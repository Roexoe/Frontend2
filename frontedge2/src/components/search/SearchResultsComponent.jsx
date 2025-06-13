"use client"

import { useState, useEffect } from "react"
import { useSearchParams, Link, useNavigate } from "react-router-dom"
import { collection, query, where, getDocs, orderBy, limit, startAfter } from "firebase/firestore"
import { db } from "../../firebase"
import Header from "../common/Header"
import Footer from "../common/Footer"

const SearchResults = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
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
            // Converteer zoekterm naar lowercase voor case-insensitive zoeken
            const lowerSearchQuery = searchQuery.toLowerCase()

            let usersQuery = query(
                collection(db, "users"),
                where("nameLower", ">=", lowerSearchQuery),
                where("nameLower", "<=", lowerSearchQuery + "\uf8ff"),
                orderBy("nameLower"),
                limit(ITEMS_PER_PAGE)
            )

            if (!isInitialSearch && lastUserDoc) {
                usersQuery = query(
                    collection(db, "users"),
                    where("nameLower", ">=", lowerSearchQuery),
                    where("nameLower", "<=", lowerSearchQuery + "\uf8ff"),
                    orderBy("nameLower"),
                    startAfter(lastUserDoc),
                    limit(ITEMS_PER_PAGE)
                )
            }

            const usersSnapshot = await getDocs(usersQuery)
            let newUsers = usersSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))

            // Fallback: als geen resultaten met nameLower, probeer originele velden
            if (newUsers.length === 0) {
                let fallbackQuery = query(
                    collection(db, "users"),
                    limit(50) // Beperk voor prestaties
                )

                const fallbackSnapshot = await getDocs(fallbackQuery)
                newUsers = fallbackSnapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .filter((user) =>
                        (user.name && user.name.toLowerCase().includes(lowerSearchQuery)) ||
                        (user.displayName && user.displayName.toLowerCase().includes(lowerSearchQuery))
                    )
                    .slice(0, ITEMS_PER_PAGE)
            }

            // For each found user, also search for their posts
            if (isInitialSearch && newUsers.length > 0) {
                await searchPostsByUsers(newUsers)
            }

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

    const searchPostsByUsers = async (foundUsers) => {
        try {
            const userIds = foundUsers.map(user => user.id)

            if (userIds.length === 0) return

            // Search for posts by these users - try multiple approaches for better results
            let allRelatedPosts = []

            // Method 1: Use userId field if it exists
            try {
                const postsQuery = query(
                    collection(db, "skills"),
                    where("userId", "in", userIds.slice(0, 10)),
                    limit(ITEMS_PER_PAGE)
                )
                const postsSnapshot = await getDocs(postsQuery)
                const relatedPosts = postsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    isRelated: true
                }))
                allRelatedPosts = [...allRelatedPosts, ...relatedPosts]
            } catch (error) {
                console.log("Method 1 failed, trying alternative approach:", error)
            }

            // Method 2: If userId doesn't work, try user.id path
            if (allRelatedPosts.length === 0) {
                try {
                    const postsQuery = query(
                        collection(db, "skills"),
                        where("user.id", "in", userIds.slice(0, 10)),
                        limit(ITEMS_PER_PAGE)
                    )
                    const postsSnapshot = await getDocs(postsQuery)
                    const relatedPosts = postsSnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                        isRelated: true
                    }))
                    allRelatedPosts = [...allRelatedPosts, ...relatedPosts]
                } catch (error) {
                    console.log("Method 2 failed:", error)
                }
            }

            // Method 3: Fallback - get all posts and filter in memory (less efficient but more reliable)
            if (allRelatedPosts.length === 0) {
                try {
                    const allPostsQuery = query(
                        collection(db, "skills"),
                        limit(50) // Limit to prevent too much data
                    )
                    const allPostsSnapshot = await getDocs(allPostsQuery)
                    const filteredPosts = allPostsSnapshot.docs
                        .map((doc) => ({
                            id: doc.id,
                            ...doc.data()
                        }))
                        .filter(post => {
                            const postUserId = post.userId || post.user?.id || post.authorId
                            return userIds.includes(postUserId)
                        })
                        .map(post => ({
                            ...post,
                            isRelated: true
                        }))

                    allRelatedPosts = [...allRelatedPosts, ...filteredPosts]
                } catch (error) {
                    console.log("Method 3 failed:", error)
                }
            }

            console.log(`Found ${allRelatedPosts.length} related posts for users:`, userIds)

            // Add these posts to the existing posts (avoid duplicates)
            if (allRelatedPosts.length > 0) {
                setPosts(prevPosts => {
                    const existingPostIds = new Set(prevPosts.map(post => post.id))
                    const newRelatedPosts = allRelatedPosts.filter(post => !existingPostIds.has(post.id))
                    console.log(`Adding ${newRelatedPosts.length} new related posts`)
                    return [...prevPosts, ...newRelatedPosts]
                })
            }

        } catch (error) {
            console.error("Error searching posts by users:", error)
        }
    }

    const searchUsersByPosts = async (foundPosts) => {
        try {
            // Get unique user IDs from found posts - try multiple field possibilities
            const userIds = [...new Set(foundPosts
                .map(post => post.userId || post.user?.id || post.authorId)
                .filter(Boolean)
            )]

            console.log(`Looking for users with IDs:`, userIds)

            if (userIds.length === 0) return

            // Search for these users
            const usersQuery = query(
                collection(db, "users"),
                where("__name__", "in", userIds.slice(0, 10)) // Firestore 'in' query limited to 10 items
            )

            const usersSnapshot = await getDocs(usersQuery)
            const relatedUsers = usersSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                isRelated: true // Mark as related result
            }))

            console.log(`Found ${relatedUsers.length} related users`)

            // Add these users to the existing users (avoid duplicates)
            if (relatedUsers.length > 0) {
                setUsers(prevUsers => {
                    const existingUserIds = new Set(prevUsers.map(user => user.id))
                    const newRelatedUsers = relatedUsers.filter(user => !existingUserIds.has(user.id))
                    console.log(`Adding ${newRelatedUsers.length} new related users`)
                    return [...prevUsers, ...newRelatedUsers]
                })
            }

        } catch (error) {
            console.error("Error searching users by posts:", error)
        }
    }

    const searchPosts = async (isInitialSearch = false) => {
        if (!isInitialSearch && (!hasMorePosts || postsLoading)) return

        setPostsLoading(true)

        try {
            // Converteer zoekterm naar lowercase voor case-insensitive zoeken
            const lowerSearchQuery = searchQuery.toLowerCase()

            let postsQuery = query(
                collection(db, "skills"),
                where("titleLower", ">=", lowerSearchQuery),
                where("titleLower", "<=", lowerSearchQuery + "\uf8ff"),
                orderBy("titleLower"),
                limit(ITEMS_PER_PAGE)
            )

            if (!isInitialSearch && lastPostDoc) {
                postsQuery = query(
                    collection(db, "skills"),
                    where("titleLower", ">=", lowerSearchQuery),
                    where("titleLower", "<=", lowerSearchQuery + "\uf8ff"),
                    orderBy("titleLower"),
                    startAfter(lastPostDoc),
                    limit(ITEMS_PER_PAGE)
                )
            }

            const postsSnapshot = await getDocs(postsQuery)
            let newPosts = postsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))

            // Fallback: als geen resultaten met titleLower, probeer originele velden
            if (newPosts.length === 0) {
                let fallbackQuery = query(
                    collection(db, "skills"),
                    limit(50) // Beperk voor prestaties
                )

                const fallbackSnapshot = await getDocs(fallbackQuery)
                newPosts = fallbackSnapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .filter((post) =>
                        post.title && post.title.toLowerCase().includes(lowerSearchQuery)
                    )
                    .slice(0, ITEMS_PER_PAGE)
            }

            // For each found post, also search for related users
            if (isInitialSearch && newPosts.length > 0) {
                await searchUsersByPosts(newPosts)
            }

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

    // FIXED: Function to handle viewing a post
    const handleViewPost = (postId) => {
        navigate(`/skill/${postId}`)
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
                                            <tr key={user.id} className={user.isRelated ? 'related-result' : ''}>
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
                                            <tr key={post.id} className={post.isRelated ? 'related-result' : ''}>
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
                                                    {/* FIXED: Added onClick handler to navigate to skill detail */}
                                                    <button
                                                        className="view-post-btn"
                                                        onClick={() => handleViewPost(post.id)}
                                                    >
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