import type { TableOfContentDataItem } from '@tiptap/extension-table-of-contents'

export const Outline = ({ tocItems }: { tocItems: TableOfContentDataItem[] }) => {
    if (!tocItems || tocItems.length === 0) {
        return <p>No outline available</p>
    }
    return (
        <div>
            <ul>
                {tocItems.map(item => (
                    <li key={item.id}>
                        <a href={`#${item.id}`}>{item.textContent}</a>
                    </li>
                ))}
            </ul>
        </div>
    )
}   