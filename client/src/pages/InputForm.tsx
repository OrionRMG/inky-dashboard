import { useEffect, useState } from "react"

type Item = {
    owner: "orion" | "maddie"
    body: string
}

function TrashIcon() {
    return (
        <svg className="trash-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 14.1667V9.16667C7.5 8.70643 7.8731 8.33333 8.33333 8.33333C8.79357 8.33333 9.16667 8.70643 9.16667 9.16667V14.1667C9.16667 14.6269 8.79357 15 8.33333 15C7.8731 15 7.5 14.6269 7.5 14.1667Z" fill="#CD3E3E"/>
            <path d="M10.8333 14.1667V9.16667C10.8333 8.70643 11.2064 8.33333 11.6667 8.33333C12.1269 8.33333 12.5 8.70643 12.5 9.16667V14.1667C12.5 14.6269 12.1269 15 11.6667 15C11.2064 15 10.8333 14.6269 10.8333 14.1667Z" fill="#CD3E3E"/>
            <path d="M3.33333 16.6667V5C3.33333 4.53976 3.70643 4.16667 4.16667 4.16667C4.6269 4.16667 5 4.53976 5 5V16.6667C5 16.8877 5.08786 17.0996 5.24414 17.2559C5.40042 17.4121 5.61232 17.5 5.83333 17.5H14.1667C14.3877 17.5 14.5996 17.4121 14.7559 17.2559C14.9121 17.0996 15 16.8877 15 16.6667V5C15 4.53976 15.3731 4.16667 15.8333 4.16667C16.2936 4.16667 16.6667 4.53976 16.6667 5V16.6667C16.6667 17.3297 16.4031 17.9654 15.9342 18.4342C15.4654 18.9031 14.8297 19.1667 14.1667 19.1667H5.83333C5.17029 19.1667 4.5346 18.9031 4.06576 18.4342C3.59691 17.9654 3.33333 17.3297 3.33333 16.6667Z" fill="#CD3E3E"/>
            <path d="M17.5 4.16667C17.9602 4.16667 18.3333 4.53976 18.3333 5C18.3333 5.46024 17.9602 5.83333 17.5 5.83333H2.5C2.03976 5.83333 1.66667 5.46024 1.66667 5C1.66667 4.53976 2.03976 4.16667 2.5 4.16667H17.5Z" fill="#CD3E3E"/>
            <path d="M12.5 5V3.33333C12.5 3.11232 12.4121 2.90042 12.2559 2.74414C12.0996 2.58786 11.8877 2.5 11.6667 2.5H8.33333C8.11232 2.5 7.90042 2.58786 7.74414 2.74414C7.58786 2.90042 7.5 3.11232 7.5 3.33333V5C7.5 5.46024 7.1269 5.83333 6.66667 5.83333C6.20643 5.83333 5.83333 5.46024 5.83333 5V3.33333C5.83333 2.67029 6.09691 2.0346 6.56576 1.56576C7.0346 1.09691 7.67029 0.833333 8.33333 0.833333H11.6667C12.3297 0.833333 12.9654 1.09691 13.4342 1.56576C13.9031 2.0346 14.1667 2.67029 14.1667 3.33333V5C14.1667 5.46024 13.7936 5.83333 13.3333 5.83333C12.8731 5.83333 12.5 5.46024 12.5 5Z" fill="#CD3E3E"/>
        </svg>
    )
}

function ChevronIcon() {
    return (
        <svg className="chevron-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.4108 6.91081C14.7362 6.58537 15.2638 6.58537 15.5892 6.91081C15.9146 7.23624 15.9146 7.76376 15.5892 8.08919L10.5892 13.0892C10.2638 13.4146 9.73624 13.4146 9.41081 13.0892L4.41081 8.08919C4.08537 7.76376 4.08537 7.23624 4.41081 6.91081C4.73624 6.58537 5.26376 6.58537 5.58919 6.91081L10 11.3216L14.4108 6.91081Z" fill="#484848"/>
        </svg>
    )
}

function ListItem({ body, handleRemove }: { body: string, handleRemove: () => void }) {
    return (
        <div className="input-list-item">
            <p className="input-list-item-text">{body}</p>
            <button className="bare-button" onClick={handleRemove}>
                <TrashIcon />
            </button>
        </div>
    )
}

export default function InputForm() {
    const [serverItems, setServerItems] = useState<Item[]>([])
    const [pendingAdds, setPendingAdds] = useState<Item[]>([])
    const [pendingRemoveIndices, setPendingRemoveIndices] = useState<Set<number>>(new Set())
    const [owner, setOwner] = useState<string>("orion")
    const [body, setBody] = useState<string>("")
    const [status, setStatus] = useState<string | null>("")
    const [submitting, setSubmitting] = useState(false)

    const displayItems = [
        ...serverItems.filter((_, i) => !pendingRemoveIndices.has(i)),
        ...pendingAdds,
    ]
    const orionItems = displayItems.filter(i => i.owner === "orion")
    const maddieItems = displayItems.filter(i => i.owner === "maddie")
    const generalItems = displayItems.filter(i => !i.owner)
    const hasPendingChanges = pendingAdds.length > 0 || pendingRemoveIndices.size > 0

    useEffect(() => {
        fetch("http://localhost:3000/api/items")
            .then(res => res.json())
            .then(data => setServerItems(data.items))
    }, [])

    function handleRemove(item: Item) {
        const serverIndex = serverItems.indexOf(item)
        if (serverIndex !== -1) {
            setPendingRemoveIndices(prev => new Set(prev).add(serverIndex))
        } else {
            setPendingAdds(prev => prev.filter(i => i !== item))
        }
    }

    function handleAdd(e: React.FormEvent) {
        e.preventDefault()
        if (!body.trim()) return
        const item: Item = { owner: owner as Item["owner"], body }
        setPendingAdds(prev => [...prev, item])
        setBody("")
    }

    async function handleSubmitChanges() {
        setSubmitting(true)
        const finalItems = [
            ...serverItems.filter((_, i) => !pendingRemoveIndices.has(i)),
            ...pendingAdds,
        ]
        try {
            const res = await fetch("http://localhost:3000/api/items", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: finalItems }),
            })
            if (!res.ok) throw new Error("Request failed")
            setServerItems(finalItems)
            setPendingAdds([])
            setPendingRemoveIndices(new Set())
            setStatus("Changes saved!")
            setTimeout(() => setStatus(null), 2000)
        } catch {
            setStatus("Something went wrong.")
        } finally {
            setSubmitting(false)
        }
    }

    function renderGroup(title: string, items: Item[]) {
        if (items.length === 0) return null
        return (
            <div className="input-group">
                <h3 className="input-group-title">{title}</h3>
                {items.map((item, i) => (
                    <ListItem
                        key={i}
                        body={item.body}
                        handleRemove={() => handleRemove(item)}
                    />
                ))}
            </div>
        )
    }

    const ownerLabel = owner === "orion" ? "Orion" : owner === "maddie" ? "Maddie" : "General"

    return (
        <div id="input-page">
            <div className="input-form-section">
                <div className="input-form-header">
                    <h1 className="input-form-title">Add Item</h1>
                    {hasPendingChanges && (
                        <button className="submit-btn" onClick={handleSubmitChanges} disabled={submitting}>
                            {submitting ? "Saving..." : "Submit"}
                        </button>
                    )}
                </div>
                <form id="input-form" onSubmit={handleAdd}>
                    <div className="owner-selector">
                        <span className="field-label">Owner</span>
                        <label className="owner-dropdown">
                            <span className="owner-value">{ownerLabel}</span>
                            <ChevronIcon />
                            <select value={owner} onChange={(e) => setOwner(e.target.value)}>
                                <option value="orion">Orion</option>
                                <option value="maddie">Maddie</option>
                                <option value="">General</option>
                            </select>
                        </label>
                    </div>
                    <div className="text-field">
                        <span className="field-label">Text</span>
                        <input
                            type="text"
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            placeholder="Add something..."
                        />
                    </div>
                    <button type="submit" className="add-btn" disabled={!body.trim()}>Add</button>
                    {status && <p className={`status-msg ${status === "Changes saved!" ? "status-success" : "status-error"}`}>{status}</p>}
                </form>
            </div>
            <div className="input-list-section">
                <h2 className="input-list-title">Current List</h2>
                {renderGroup("Orion", orionItems)}
                {renderGroup("Maddie", maddieItems)}
                {renderGroup("General", generalItems)}
            </div>
        </div>
    )
}
