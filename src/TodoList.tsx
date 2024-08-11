import { FilterValuesType } from "./App"



function sum(a: number, b: number) {
    alert(a + b)
}
//sum(12,14);

export type TaskType = {
    id: number
    title: string
    isDone: boolean

}

type PropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (id: number) => void
    changeFilter: (value: FilterValuesType) => void
}


export function TodoList(props: PropsType) {
    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input type="text" />
                <button>+</button>
            </div>
            <ul>
                {
                    props.tasks.map((t) => {
                        return <li>
                            <input type="checkbox" checked={t.isDone} />
                            <span>{t.title}</span>
                            <button onClick={() => { props.removeTask(t.id) }}>X</button>
                        </li>
                    })
                }
            </ul>
            <div>
                <button onClick={() => { props.changeFilter("all") }}>All</button>
                <button onClick={() => { props.changeFilter("active") }}>Active</button>
                <button onClick={() => { props.changeFilter("completed") }}>Completed</button>
            </div>
        </div>
    )
}