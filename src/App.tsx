import './App.css'
import { UploadCSVFile } from './upload-data/UploadCSVFile.tsx'
import type { CSV_Data, Pair } from './types/types.ts'
import { useCallback, useEffect, useState, useTransition } from 'react'
import { CSVDataTable } from './csv-data-table/CSVDataTable.tsx'
import { Loader } from './loader/Loader.tsx'

function App() {
    const [isPending, startTransition] = useTransition()
    const [rawData, setRawData] = useState<CSV_Data[]>([])
    const [pairs, setPairs] = useState<Pair[]>([])

    const onFileUpload = (event: ProgressEvent<FileReader>) => {
        const content = event.target?.result
        if (typeof content === 'string') {
            const rawData = content.split('\n')
            const rows: CSV_Data[] = []

            for (let i = 1; i < rawData.length; i++) {
                if (rawData[i] === '') {
                    continue
                }

                const data = rawData[i].split(',')

                const row = {
                    ID: Number(data[0]),
                    EmpID: Number(data[1]),
                    ProjectID: Number(data[2]),
                    DateFrom: new Date(data[3]),
                    DateTo: data[4] === 'NULL' ? new Date() : new Date(data[4]),
                }

                rows.push(row)
            }

            startTransition(() => {
                setRawData(rows)
            })
        }
    }

    const getWorkingDays = (startDay: Date, endDate: Date | 'NULL') => {
        const start = new Date(startDay)
        let end

        if (endDate === 'NULL') {
            end = new Date()
        } else {
            end = new Date(endDate)
        }

        let counter = 0
        while (start <= end) {
            const day = start.getDay()

            if (day >= 1 || day <= 5) {
                counter++
            }
            start.setDate(start.getDate() + 1)
        }
        return counter
    }

    const getPairOfWorkersPerProject = useCallback((rawData: CSV_Data[]) => {
        const projectIDs = [...new Set(rawData.map((value) => value.ProjectID))]
        const mostWorked: Pair[] = []
        for (const value of projectIDs) {
            const employees = rawData
                .filter((employee) => {
                    return employee.ProjectID === value
                })
                .sort((a, b) => {
                    const a_days = getWorkingDays(a.DateFrom, a.DateTo)
                    const b_days = getWorkingDays(b.DateFrom, b.DateTo)

                    if (a_days < b_days) {
                        return 1
                    } else if (b_days < a_days) {
                        return -1
                    } else {
                        return 0
                    }
                })

            mostWorked.push({
                EmpID_1: employees[0].EmpID,
                EmpID_2: employees[1].EmpID,
                ProjectID: employees[0].ProjectID,
                DaysWorked:
                    getWorkingDays(employees[0].DateFrom, employees[0].DateTo) +
                    getWorkingDays(employees[1].DateFrom, employees[1].DateTo),
            })
        }

        setPairs(mostWorked)
    }, [])

    useEffect(() => {
        getPairOfWorkersPerProject(rawData)
    }, [rawData, getPairOfWorkersPerProject])

    return (
        <>
            {isPending && <Loader />}
            <UploadCSVFile onFileUpload={onFileUpload} />
            {pairs.length > 0 && <CSVDataTable rows={pairs} />}
        </>
    )
}

export default App
