import { type ChangeEvent, useRef } from 'react'

export const UploadCSVFile = ({
    onFileUpload,
}: {
    onFileUpload: (ev: ProgressEvent<FileReader>) => void
}) => {
    const ref = useRef<HTMLInputElement>(null)

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const uploadFile = event.target.files?.[0]
        if (uploadFile?.type !== 'text/csv') {
            alert('Wrong type of data! Only CSV is supported.')
            return
        }

        const reader = new FileReader()

        reader.onload = onFileUpload

        reader.readAsText(uploadFile)
    }

    return (
        <>
            <input ref={ref} hidden type="file" onChange={handleChange} />
            <button onClick={() => ref?.current?.click()}>
                Upload CSV File
            </button>
        </>
    )
}
