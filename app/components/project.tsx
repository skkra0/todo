import classNames from "classnames";
import { Category } from "./types";
import Editable from "./editable";
import { useEffect, useRef } from "react";

interface ProjectProps {
    cat: Category;
    onDelete: (cat: Category) => void;
    onUpdate: (cat: Category) => void;
    sendCatToDaily?: (cat: Category) => void;
    sendItemToDaily?: (cat: Category, item: string) => void;
    master?: boolean;
}
const Project = ({cat, onDelete, onUpdate, sendCatToDaily, sendItemToDaily, master} : ProjectProps) => {
    const catRef = useRef(cat);
    useEffect(() => {
        catRef.current = cat;
    }, [cat]);
    return <div className={classNames("group mb-3 p-3 rounded-md max-w-4xl min-w-96", master ? "bg-master" : "bg-daily")}>
        <Editable
            className="text-2xl inline-block font-semibold"
            initial={cat.title}
            onBlur={(content: string) => {
                onUpdate({...catRef.current, title: content} as Category);
            }}
        />  
        <div className="hidden group-hover:inline-block">
            <button
                className={classNames("inline border-2 rounded", master ? "border-master-border" : "border-daily-border")}
                onClick={() => onDelete(cat)}>delete me</button>
            { master ?
                <button
                className="inline border-2 rounded border-master-border"
                onClick={() => {
                    sendCatToDaily && sendCatToDaily(cat);
                }}>send to daily</button> : null }
        </div>
        
        <ul>
            {
            cat.items.map((item, i) => {
                return <li key={(master ? "master" : "daily") + `-item-${cat.key}-${i}`} className="relative mt-2 text-sm">
                    <input
                        type="checkbox"
                        id={(master ? "master" : "daily") + `-item-checkbox-${cat.key}-${i}`}
                        className="relative appearance-none w-5 h-5 align-sub border-slate-600 border-2 rounded-sm mr-2 shrink-0 peer
                                hover:border-slate-800"
                        checked={cat.finished[i]}
                        onChange={(e) => {
                            onUpdate(
                                {...catRef.current,
                                    finished: cat.finished.map((f, j) => j === i ? e.target.checked : f)
                                } as Category
                            );
                          }}
                    />
                    <label 
                    //htmlFor={`master-item-checkbox-${cat.key}-${i}`}
                    className="leading-7"
                    >
                        <Editable
                            className="text-lg inline min-w-52"
                            initial={item}
                            onBlur={(content) => {
                                onUpdate({
                                    ...catRef.current,
                                    items: cat.items.map((it, j) => j === i ? content : it)
                                    } as Category
                                );
                            }}
                        />
                    </label>
                    <svg
                        className="
                                absolute left-0 top-0 w-5 h-8 hidden align-sub text-slate-600 pointer-events-none
                                peer-checked:block"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <title>Checkmark</title>
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    </li>
            })}
            <li className="relative mt-2 text-sm">
                <input
                    type="checkbox"
                    id={(master ? "master" : "daily") + `-${cat.key}-newitem`}
                    className="relative appearance-none w-5 h-5 align-sub border-slate-400 border-2 rounded-sm mr-2 shrink-0"
                />
                <label className="leading-7">
                    <Editable
                        className={classNames("text-lg inline-block", master ? "before:text-white" : "")}
                        initial=""
                        placeholder="New item..."
                        onBlur={(content) => {
                            onUpdate({...catRef.current,
                                items: [...catRef.current.items, content],
                                finished: [...catRef.current.finished, false]
                            } as Category
                        );
                        }}
                        clearOnBlur
                    />
                </label>
                <svg
                    className="
                            absolute left-0 top-0 w-4 h-4 hidden align-sub text-white pointer-events-none
                            peer-checked:block"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <title>Checkmark</title>
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </li>
        </ul>
    </div>
}
export default Project;