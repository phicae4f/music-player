import { useEffect } from "react"
import { TracksList } from "../components/TracksList"
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { getFavouriteTracks } from "../store/favouritesSlice"

export const FavouritePage = () => {
    const dispatch = useAppDispatch()
    const {favourites} = useAppSelector(state => state.favourites)

    useEffect(() => {
        dispatch(getFavouriteTracks())
    }, [dispatch])

    return (
        <section className="audio">
                <div className="container">
                    <div className="audio__wrapper">
                        <h2 className="audio__title">Избранное</h2>
                        {favourites.length === 0 ? (
                            <span>В избранном пока ничего нет</span>
                        ): (
                            <TracksList audios={favourites}/>
                        )}
                    </div>
                </div>
        </section>
    )
}