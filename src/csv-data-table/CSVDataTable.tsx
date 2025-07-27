import type { Pair } from '../types/types.ts'

export const CSVDataTable = ({ rows }: { rows: Pair[] }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>First Employee ID</th>
                    <th>Second Employee ID</th>
                    <th>Project ID</th>
                    <th>Total days spend</th>
                </tr>
            </thead>
            <tbody>
                {rows.map((row, index) => (
                    <tr key={index}>
                        {Object.values(row).map((value, index) => {
                            return <td key={index}>{value}</td>
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
