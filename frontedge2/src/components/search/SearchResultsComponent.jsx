"use client"

import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { collection, query, where, getDocs, orderBy, limit, startAfter } from "firebase/firestore"
import { db } from "../../firebase"
import Header from "../common/Header"
import Footer from "../common/Footer"

const SearchResults = () => {
    const [searchParams] = useSearchParams()
    const [users, setUsers] = useState([])
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [usersLoading, setUsersLoading] = useState(false)
    const [postsLoading, setPostsLoading] = useState(false)
    const [lastUserDoc, setLastUserDoc] = useState(null)
    const [lastPostDoc, setLastPostDoc] = useState(null)
    const [hasMoreUsers, setHasMoreUsers] = useState(true)
    const [hasMorePosts, setHasMorePosts] = useState(true)

    const searchQuery = searchParams.get('q') || ''
    const ITEMS_PER_PAGE = 10

    useEffect(() => {
        if (searchQuery) {
            performSearch()
        }
    }, [searchQuery])

    const performSearch = async () => {
        setLoading(true)
        setUsers([])
        setPosts([])
        setLastUserDoc(null)
        setLastPostDoc(null)
        setHasMoreUsers(true)
        setHasMorePosts(true)

        try {
            await Promise.all([
                searchUsers(true),
                searchPosts(true)
            ])
        } catch (error) {
            console.error("Error performing search:", error)
        } finally {
            setLoading(false)
        }
    }

    const searchUsers = async (isInitialSearch = false) => {
        if (!isInitialSearch && (!hasMoreUsers || usersLoading)) return

        setUsersLoading(true)

        try {
            let usersQuery = query(
                collection(db, "users"),
                where("name", ">=", searchQuery),
                where("name", "<=", searchQuery + "\uf8ff"),
                orderBy("name"),
                limit(ITEMS_PER_PAGE)
            )

            if (!isInitialSearch && lastUserDoc) {
                usersQuery = query(
                    collection(db, "users"),
                    where("name", ">=", searchQuery),
                    where("name", "<=", searchQuery + "\uf8ff"),
                    orderBy("name"),
                    startAfter(lastUserDoc),
                    limit(ITEMS_PER_PAGE)
                )
            }

            const usersSnapshot = await getDocs(usersQuery)
            const newUsers = usersSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))

            if (isInitialSearch) {
                setUsers(newUsers)
            } else {
                setUsers(prev => [...prev, ...newUsers])
            }

            setLastUserDoc(usersSnapshot.docs[usersSnapshot.docs.length - 1])
            setHasMoreUsers(usersSnapshot.docs.length === ITEMS_PER_PAGE)

        } catch (error) {
            console.error("Error searching users:", error)
        } finally {
            setUsersLoading(false)
        }
    }

    const searchPosts = async (isInitialSearch = false) => {
        if (!isInitialSearch && (!hasMorePosts || postsLoading)) return

        setPostsLoading(true)

        try {
            let postsQuery = query(
                collection(db, "skills"),
                where("title", ">=", searchQuery),
                where("title", "<=", searchQuery + "\uf8ff"),
                orderBy("title"),
                limit(ITEMS_PER_PAGE)
            )

            if (!isInitialSearch && lastPostDoc) {
                postsQuery = query(
                    collection(db, "skills"),
                    where("title", ">=", searchQuery),
                    where("title", "<=", searchQuery + "\uf8ff"),
                    orderBy("title"),
                    startAfter(lastPostDoc),
                    limit(ITEMS_PER_PAGE)
                )
            }

            const postsSnapshot = await getDocs(postsQuery)
            const newPosts = postsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))

            if (isInitialSearch) {
                setPosts(newPosts)
            } else {
                setPosts(prev => [...prev, ...newPosts])
            }

            setLastPostDoc(postsSnapshot.docs[postsSnapshot.docs.length - 1])
            setHasMorePosts(postsSnapshot.docs.length === ITEMS_PER_PAGE)

        } catch (error) {
            console.error("Error searching posts:", error)
        } finally {
            setPostsLoading(false)
        }
    }

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "Onbekend"

        try {
            if (timestamp.seconds) {
                const date = new Date(timestamp.seconds * 1000)
                return date.toLocaleDateString('nl-NL')
            }
            return timestamp
        } catch (error) {
            return "Onbekend"
        }
    }

    if (loading) {
        return (
            <div className="app-container">
                <Header />
                <main className="container">
                    <div className="search-results-container">
                        <h1>Zoeken naar "{searchQuery}"...</h1>
                        <div className="loading-spinner">Resultaten worden geladen...</div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="app-container">
            <Header />
            <main className="container">
                <div className="search-results-container">
                    <h1>Zoekresultaten voor "{searchQuery}"</h1>

                    {/* Users Table */}
                    <section className="results-section">
                        <h2>Gebruikers ({users.length})</h2>
                        {users.length > 0 ? (
                            <div className="results-table">
                                <div className="table-container">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Gebruiker</th>
                                            <th>Biografie</th>
                                            <th>Aangesloten</th>
                                            <th>Acties</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td>
                                                    <div className="user-info">
                                                        <img
                                                            src={user.photoURL || user.avatar || "/src/assets/skillr-hand.png"}
                                                            alt={user.name || user.displayName}
                                                            className="user-avatar"
                                                        />
                                                        <div>
                                                            <div className="user-name">{user.name || user.displayName || "Onbekende gebruiker"}</div>
                                                            <div className="user-email">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="user-bio">{user.bio || "Geen biografie beschikbaar"}</td>
                                                <td>{formatTimestamp(user.createdAt)}</td>
                                                <td>
                                                    <Link to={`/profile/${user.id}`} className="view-profile-btn">
                                                        Bekijk Profiel
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                {hasMoreUsers && (
                                    <div className="load-more-container">
                                        <button
                                            onClick={() => searchUsers(false)}
                                            disabled={usersLoading}
                                            className="load-more-btn"
                                        >
                                            {usersLoading ? "Laden..." : "Volgende pagina"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="no-results">Geen gebruikers gevonden</div>
                        )}
                    </section>

                    {/* Posts Table */}
                    <section className="results-section">
                        <h2>Posts ({posts.length})</h2>
                        {posts.length > 0 ? (
                            <div className="results-table">
                                <div className="table-container">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Titel</th>
                                            <th>Beschrijving</th>
                                            <th>Auteur</th>
                                            <th>Geplaatst</th>
                                            <th>Acties</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {posts.map((post) => (
                                            <tr key={post.id}>
                                                <td className="post-title">{post.title}</td>
                                                <td className="post-description">
                                                    {post.description ?
                                                        (post.description.length > 100 ?
                                                                post.description.substring(0, 100) + "..." :
                                                                post.description
                                                        ) :
                                                        "Geen beschrijving"
                                                    }
                                                </td>
                                                <td>
                                                    <div className="post-author">
                                                        <img
                                                            src={post.user?.avatar || "/src/assets/skillr-hand.png"}
                                                            alt={post.user?.name || "Onbekend"}
                                                            className="author-avatar"
                                                        />
                                                        <span>{post.user?.name || "Onbekende auteur"}</span>
                                                    </div>
                                                </td>
                                                <td>{formatTimestamp(post.timestamp)}</td>
                                                <td>
                                                    <button className="view-post-btn">
                                                        Bekijk Post
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                {hasMorePosts && (
                                    <div className="load-more-container">
                                        <button
                                            onClick={() => searchPosts(false)}
                                            disabled={postsLoading}
                                            className="load-more-btn"
                                        >
                                            {postsLoading ? "Laden..." : "Volgende pagina"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="no-results">Geen posts gevonden</div>
                        )}
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default SearchResults