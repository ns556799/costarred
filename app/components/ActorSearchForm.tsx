"use client"

import { useSearchStore } from "../store/useSearchStore"

export default function ActorSearchForm({onSearch} : {onSearch: () => void}) {
    const {actor1, actor2, setActor1, setActor2} = useSearchStore()

    return (
        <div className="flex flex-col gap-2 max-w-md mx-auto">
            <input type="text" className="border rounder p-2" placeholder="First actors name" value={actor1} onChange={e => setActor1(e.target.value)} />
            <input type="text" className="border rounder p-2" placeholder="Second actors name" value={actor2} onChange={e => setActor2(e.target.value)} />

            <button onClick={onSearch} className="bg-blue-600 text-white p-2 rounded">
                Find Shared Movies
            </button>
        </div>
    )
}