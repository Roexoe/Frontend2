import Header from "../common/Header"
import Footer from "../common/Footer"

const TermsOfService = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow bg-gray-50 p-12">
                <div className="container mx-auto p-4 max-w-4xl">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Gebruiksvoorwaarden</h1>

                        <div className="prose max-w-none">
                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptatie van voorwaarden</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Door toegang te krijgen tot en gebruik te maken van Skillrr, accepteert u deze gebruiksvoorwaarden
                                    volledig. Als u niet akkoord gaat met deze voorwaarden, mag u onze diensten niet gebruiken.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Beschrijving van de dienst</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Skillrr is een sociaal mediaplatform waar gebruikers hun vaardigheden kunnen delen,
                                    posts kunnen plaatsen, kunnen chatten met andere gebruikers en hun profiel kunnen beheren.
                                    Gebruikers kunnen kiezen om hun profiel publiek of privé te maken.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Gebruikersaccounts</h2>
                                <div className="text-gray-700 leading-relaxed">
                                    <p className="mb-3">Bij het maken van een account verplicht u zich tot:</p>
                                    <ul className="list-disc pl-6 mb-4 space-y-2">
                                        <p>Het verstrekken van juiste en volledige informatie</p>
                                        <p>Het onderhouden van de beveiliging van uw account</p>
                                        <p>Het accepteren van verantwoordelijkheid voor alle activiteiten onder uw account</p>
                                        <p>Het onmiddellijk melden van ongeautoriseerd gebruik van uw account</p>
                                    </ul>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        U moet minimaal 13 jaar oud zijn om een account aan te maken. Gebruikers onder de 16 jaar
                                        hebben toestemming van een ouder of voogd nodig.
                                    </p>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Toegestaan gebruik</h2>
                                <div className="text-Gray-700 leading-relaxed">
                                    <p className="mb-3">U mag Skillrr gebruiken voor:</p>
                                    <ul className="list-disc pl-6 mb-4 space-y-2">
                                        <p>Het delen van uw vaardigheden en expertise</p>
                                        <p>Het netwerken met andere professionals</p>
                                        <p>Het leren van anderen door het bekijken van hun content</p>
                                        <p>Het voeren van respectvolle gesprekken via de chatfunctie</p>
                                    </ul>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Verboden gebruik</h2>
                                <div className="text-gray-700 leading-relaxed">
                                    <p className="mb-3">Het is verboden om Skillrr te gebruiken voor:</p>
                                    <ul className="list-disc pl-6 mb-4 space-y-2">
                                        <p>Het plaatsen van illegale, schadelijke of aanstootgevende content</p>
                                        <p>Intimidatie, pesten of lastigvallen van andere gebruikers</p>
                                        <p>Het verspreiden van spam, malware of virussen</p>
                                        <p>Het schenden van intellectuele eigendomsrechten</p>
                                        <p>Het impersoneren van andere personen of entiteiten</p>
                                        <p>Het verzamelen van persoonlijke gegevens van andere gebruikers zonder toestemming</p>
                                        <p>Commerciële activiteiten zonder onze voorafgaande toestemming</p>
                                    </ul>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Content en intellectueel eigendom</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    U behoudt eigendom van de content die u plaatst op Skillrr. Door content te plaatsen,
                                    verleent u ons echter een niet-exclusieve, royalty-vrije licentie om uw content te gebruiken,
                                    te reproduceren en te distribueren binnen onze diensten.
                                </p>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    U bent verantwoordelijk voor de content die u plaatst en garandeert dat u alle benodigde rechten heeft.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Privacy en gegevensbescherming</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Uw privacy is belangrijk voor ons. Ons privacybeleid beschrijft hoe wij uw persoonlijke gegevens
                                    verzamelen, gebruiken en beschermen. Door onze diensten te gebruiken, stemt u in met ons privacybeleid.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Moderatie en handhaving</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Wij behouden ons het recht voor om content te verwijderen, accounts op te schorten of te beëindigen,
                                    en andere passende maatregelen te nemen bij schending van deze voorwaarden. Wij kunnen content
                                    modereren, maar zijn niet verplicht alle content te controleren.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Beëindiging</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    U kunt uw account op elk moment beëindigen. Wij kunnen uw toegang opschorten of beëindigen
                                    bij schending van deze voorwaarden. Bij beëindiging kunnen bepaalde bepalingen van deze
                                    voorwaarden van kracht blijven.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Disclaimer en aansprakelijkheidsbeperking</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Skillrr wordt geleverd "zoals het is" zonder enige garantie. Wij zijn niet aansprakelijk voor
                                    indirecte, incidentele of gevolgschade die voortvloeit uit het gebruik van onze diensten.
                                    Onze totale aansprakelijkheid is beperkt tot het bedrag dat u aan ons heeft betaald in de
                                    12 maanden voorafgaand aan de claim.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Wijzigingen in de voorwaarden</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Wij kunnen deze gebruiksvoorwaarden van tijd tot tijd bijwerken. Belangrijke wijzigingen
                                    zullen worden gecommuniceerd via onze website. Voortgezet gebruik na wijzigingen betekent
                                    acceptatie van de nieuwe voorwaarden.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Toepasselijk recht</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Deze gebruiksvoorwaarden worden beheerst door Nederlands recht. Geschillen zullen worden
                                    voorgelegd aan de bevoegde rechtbanken in Nederland.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">13. Contact</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Voor vragen over deze gebruiksvoorwaarden kunt u contact met ons opnemen via de contactpagina
                                    of per e-mail.
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

export default TermsOfService