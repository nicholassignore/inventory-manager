import React, {useState} from "react";

const Form = () => {

    const sumUsed = (itemId) =>
        transactions.reduce((sum, t) => sum + (Number(t.values?.[itemId]) || 0), 0);

    const [items] = useState([
        { id: "taschen_rosa_grau", name: "Taschen rosa mit grauer Schrift", initialStock: 176 },
        { id: "taschen_rosa_schwarz", name: "Taschen rosa mit schwarzer Schrift", initialStock: 115 },
        { id: "magazin_alt", name: "Magazin ALT", initialStock: 220 },
        { id: "magazin_neu", name: "Magazin NEU", initialStock: 27 },
        { id: "flyer", name: "Flyer", initialStock: 110 },
    ]);

    const [transactions, setTransactions] = useState([
        { id: 1, name: "Fotoshooting Leonie", values: {} },
        { id: 2, name: "Fotoshooting Leon", values: {} },
        { id: 3, name: "Fotoshooting Amar", values: {} },
        { id: 4, name: "Fotoshooting Sadir", values: {} },
    ]);

    return <>
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
                                value={transaction.values[item.id] || 0}
                                onChange={(event) => {
                                    const value = Number(event.target.value);
                                    setTransactions((prev) =>
                                        prev.map((t) =>
                                            t.id === transaction.id
                                                ? {
                                                    ...t,
                                                    values: {
                                                        ...t.values,
                                                        [item.id]: value,
                                                    },
                                                }
                                                : t
                                        )
                                    );
                                }}
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
    </>
}

export default Form