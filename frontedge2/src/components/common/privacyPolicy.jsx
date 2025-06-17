import Header from "../common/Header"
import Footer from "../common/Footer"

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow bg-gray-50 p-12">
                <div className="container mx-auto p-4 max-w-4xl">
                    <div className="bg-white rounded-lg">
                        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Privacybeleid</h1>

                        <div className="prose max-w-none">
                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Inleiding</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Welkom bij Skillrr. Wij respecteren uw privacy en zijn toegewijd aan het beschermen van uw persoonlijke gegevens.
                                    Dit privacybeleid informeert u over hoe wij omgaan met uw persoonlijke gegevens wanneer u onze website bezoekt
                                    en vertelt u over uw privacyrechten.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Gegevens die wij verzamelen</h2>
                                <div className="text-gray-700 leading-relaxed">
                                    <p className="mb-3">Wij kunnen de volgende categorieën persoonlijke gegevens verzamelen:</p>
                                    <ul className="list-disc pl-6 mb-4 space-y-2">
                                        <p>-Accountgegevens: naam, e-mailadres, gebruikersnaam</p>
                                        <p>-Profielinformatie: biografie, vaardigheden, profielfoto</p>
                                        <p>-Inhoud: posts, berichten, reacties die u deelt</p>
                                        <p>-Technische gegevens: IP-adres, browsertype, apparaatinformatie</p>
                                        <p>-Gebruiksgegevens: hoe u de website gebruikt, welke pagina's u bezoekt</p>
                                    </ul>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Hoe wij uw gegevens gebruiken</h2>
                                <div className="text-gray-700 leading-relaxed">
                                    <p className="mb-3">Wij gebruiken uw persoonlijke gegevens voor:</p>
                                    <ul className="list-disc pl-6 mb-4 space-y-2">
                                        <p>Het leveren en onderhouden van onze diensten</p>
                                        <p>Het verbeteren van gebruikerservaring</p>
                                        <p>Communicatie met gebruikers</p>
                                        <p>Beveiliging en fraudepreventie</p>
                                        <p>Naleving van wettelijke verplichtingen</p>
                                    </ul>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Delen van gegevens</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Wij verkopen, verhuren of delen uw persoonlijke gegevens niet met derden, behalve:
                                </p>
                                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                                    <p>Met uw expliciete toestemming</p>
                                    <p>Om te voldoen aan wettelijke verplichtingen</p>
                                    <p>Met vertrouwde serviceproviders die ons helpen bij het leveren van onze diensten</p>
                                    <p>In geval van een fusie, overname of verkoop van activa</p>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Gegevensbeveiliging</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Wij implementeren passende technische en organisatorische maatregelen om uw persoonlijke gegevens
                                    te beschermen tegen ongeautoriseerde toegang, wijziging, openbaarmaking of vernietiging.
                                    Onze beveiligingsmaatregelen omvatten encryptie, toegangscontroles en regelmatige beveiligingsaudits.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Uw rechten</h2>
                                <div className="text-gray-700 leading-relaxed">
                                    <p className="mb-3">Onder de AVG heeft u de volgende rechten:</p>
                                    <ul className="list-disc pl-6 mb-4 space-y-2">
                                        <p>Recht op toegang tot uw persoonlijke gegevens</p>
                                        <p>Recht op rectificatie van onjuiste gegevens</p>
                                        <p>Recht op verwijdering ('recht om vergeten te worden')</p>
                                        <p>Recht op beperking van verwerking</p>
                                        <p>Recht op gegevensoverdraagbaarheid</p>
                                        <p>Recht van bezwaar tegen verwerking</p>
                                    </ul>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Cookies</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Onze website gebruikt cookies om uw ervaring te verbeteren. Cookies zijn kleine tekstbestanden
                                    die op uw apparaat worden opgeslagen. U kunt cookies beheren via uw browserinstellingen,
                                    maar het uitschakelen van cookies kan de functionaliteit van de website beïnvloeden.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Bewaarperiode</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Wij bewaren uw persoonlijke gegevens niet langer dan noodzakelijk voor de doeleinden
                                    waarvoor zij zijn verzameld, tenzij een langere bewaarperiode wettelijk vereist is.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Wijzigingen in dit beleid</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Wij kunnen dit privacybeleid van tijd tot tijd bijwerken. Belangrijke wijzigingen
                                    zullen worden gecommuniceerd via onze website of per e-mail.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Contact</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Voor vragen over dit privacybeleid of over de verwerking van uw persoonlijke gegevens,
                                    kunt u contact met ons opnemen via de contactpagina of per e-mail.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default PrivacyPolicy