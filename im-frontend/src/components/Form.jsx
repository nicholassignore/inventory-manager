import React, {useEffect, useState} from "react";

const Form = () => {
    const [items, setItems] = useState([]);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/get-items.php")
            .then(res => res.json())
            .then(data => {
                setItems(data.items);
            })
    }, []);

    useEffect(() => {
            fetch("http://localhost:8000/api/get-transactions.php")
                .then(res => res.json())
                .then(data => {
                    const safe = (data.transactions || []).map(t => ({
                        ...t,
                        values: t.values || {}
                    }))
                    setTransactions(safe)
                })
    }, [])


    function sumUsed(itemId) {
        let total = 0;

        for (const transaction of transactions) {
            const value = Number(transaction.values?.[itemId] || 0);
            total += value;
        }

        return total;
    }

    function getAvailable(itemId, transactionId, transactions, items) {
        const item = items.find(i => i.id === itemId);
        if (!item) return 0;

        let otherSum = 0;
        for (const t of transactions) {
            if (t.id === transactionId) continue;
            otherSum += Number(t.values?.[itemId] || 0);
        }
        return Math.max(0, item.initialStock - otherSum);
    }

    function handleSaveToServer() {
        const payload = { transactions };

        fetch("http://localhost:8000/api/save-transactions.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transactions }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data?.success) {
                    console.log("Save successful ✅");
                } else {
                    console.log("Save failed ❌", data);

                }
            })
            .catch((err) => {
                console.error(err);
                console.log("Network error while saving ❌");
            });
    }

    const handleValueChange = (transactionId, itemId, event) => {
            const value = Math.max(0, Number(event.target.value) || 0);

            const item = items.find((i) => i.id === itemId);
            if (!item) return;

        const available = getAvailable(itemId, transactionId, transactions, items);


        const limitedValue = Math.min(value, available);

            setTransactions((prev) =>
                prev.map((t) =>
                    t.id === transactionId
                        ? {
                            ...t,
                            values: {
                                ...t.values,
                                [itemId]: limitedValue,
                            },
                        }
                        : t
                )
            );
    }

    return <div className="table-wrapper">
        <table>
            <thead>
                <tr>
                    <th>Name, Veranstaltung</th>
                    {items.map(item => (
                        <th key={item.id}>
                            {item.name}
                        </th>
                    ))}
                    <th></th>
                </tr>
            </thead>

            <tbody>
            <tr>
                <td>Bestand</td>
                {items.map((item) => (
                    <td key={item.id}>{item.initialStock}</td>
                ))}
                <td></td>
            </tr>

            {transactions.map((transaction) => (
                <tr key={transaction.id}>
                    <td>{transaction.name}</td>
                    {items.map((item) => {
                        const availableForThisCell = getAvailable(item.id, transaction.id, transactions, items);
                        const currentValue = Number(transaction.values?.[item.id] || 0);
                        return (
                            <td key={item.id}>
                                <input
                                    type="number"
                                    min="0"
                                    max={availableForThisCell}
                                    value={currentValue}
                                    title={`Max: ${availableForThisCell}`}
                                    disabled={availableForThisCell === 0 && currentValue === 0}
                                    onChange={(event) => handleValueChange(transaction.id, item.id, event)}
                                />
                            </td>
                        );
                    })}
                </tr>
            ))}
            </tbody>
            <tfoot>
            <tr>
                <td>Verbraucht gesamt</td>
                {items.map((item) => (
                    <td key={item.id}>{sumUsed(item.id)}</td>
                ))}
            </tr>

            <tr>
                <td>Restbestand</td>
                {items.map((item) => {
                    const remaining = item.initialStock - sumUsed(item.id);
                    return <td key={item.id}>{remaining}</td>;
                })}
            </tr>
            </tfoot>
        </table>
            <button onClick={handleSaveToServer}>Save</button>
    </div>
}

export default Form