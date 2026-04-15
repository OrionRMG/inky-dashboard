import { useEffect, useState } from "react"

type Item = {
    owner: "orion" | "maddie"
    body: string
}

function ListItem({ body, bulletClass }: { body: string, bulletClass: string }) {
    return (
        <div className="list-item">
            <span className={`list-item-bullet ${bulletClass}`}>*</span>
            <p className="list-item-text">{body}</p>
        </div>
    )
}

export default function Display() {
    const [items, setItems] = useState<Item[]>([])

    useEffect(() => {
        fetch("http://localhost:3000/api/items")
            .then(res => res.json())
            .then(data => setItems(data.items))
    }, [])

    const orionItems = items.filter(i => i.owner === "orion")
    const maddieItems = items.filter(i => i.owner === "maddie")
    const generalItems = items.filter(i => !i.owner)

    return (
        <main id="display-page">
            <section className="top-section">
                <div className="list-box orion-box">
                    <div className="list-header orion-header">
                        <h1 className="orion-title">Orion</h1>
                    </div>
                    {orionItems.map((item, i) => (
                        <ListItem key={i} body={item.body} bulletClass="bullet-orion" />
                    ))}
                </div>
                <div className="list-box maddie-box">
                    <div className="list-header maddie-header">
                        <h1 className="maddie-title">Maddie</h1>
                    </div>
                    {maddieItems.map((item, i) => (
                        <ListItem key={i} body={item.body} bulletClass="bullet-maddie" />
                    ))}
                </div>
            </section>
            <section className="bottom-section">
                <div className="list-box general-box">
                    <div className="list-header general-header">
                        <h1 className="general-title">General</h1>
                    </div>
                    {generalItems.map((item, i) => (
                        <ListItem key={i} body={item.body} bulletClass="bullet-general" />
                    ))}
                </div>
            </section>
        </main>
    )
}
