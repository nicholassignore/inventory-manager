import React, {useEffect, useState} from "react";

const Form = () => {

    useEffect(() => {
        fetch("http://localhost:8000/api/get-items.php")
            .then(res => res.json())
            .then(data => {
                console.log(data.items);
                setItems(data.items);
            })
    }, []);

    const [items, setItems] = useState([]);

    const [transactions, setTransactions] = useState([
        { id: 1, name: "Fotoshooting Leonie", values: {} },
        { id: 2, name: "Fotoshooting Leon", values: {} },
        { id: 3, name: "Fotoshooting Amar", values: {} },
        { id: 4, name: "Fotoshooting Sadir", values: {} },
    ]);

    function sumUsed(itemId) {
        let total = 0;

        for (const transaction of transactions) {
            const value = Number(transaction.values?.[itemId] || 0);
            total += value;
        }

        return total;
    }

    const handleValueChange = (transactionId, itemId, event) => {
            const value = Number(event.target.value);

            const item = items.find((i) => i.id === itemId);
            if (!item) return;

            let otherSum = 0;

            for (let i = 0; i < transactions.length; i++) {
                const t = transactions[i];

                if (t.id === transactionId) {
                    continue;
                }

                const usedValue = t.values && t.values[itemId] ? Number(t.values[itemId]) : 0;

                otherSum += usedValue;
            }

            const available = item.initialStock - otherSum;

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
                    {items.map((item) => (
                        <td key={item.id}>
                            <input
                                type="number"
                                min="0"
                                max={item.initialStock}
                                value={transaction.values[item.id] || 0}
                                onChange={(event) => handleValueChange(transaction.id, item.id, event)}
                            />
                        </td>
                    ))}
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
    </div>
}

export default Form