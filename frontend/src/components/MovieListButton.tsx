import { useTranslation } from "react-i18next";
import "./MovieListButton.css";

interface Props 
{
    movieId: number;
    type: "watchlist" | "favorites";
    action: "add" | "remove";
    triggerToast: (message: string, icon?: string) => void;
    onSuccess?: () => void;
}

const MovieListButton = ({ movieId, type, action, triggerToast, onSuccess }: Props) => 
{
    const { t } = useTranslation();

    const handleClick = async () => 
    {
        const token = localStorage.getItem("token");
        const method = action === "add" ? "POST" : "DELETE";
        try 
        {
            const res = await fetch(`/api/${type}/${movieId}`, 
        {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok)
        {
            const data = await res.json();

            if (res.status === 409)
            {
                triggerToast(data.error, "⚠️");
                return;
            }

            throw new Error(`Error ${res.status}`);
        }

        if (!res.ok) 
        {
            throw new Error(`Error ${res.status}`);
        }

        if (action === "add" && type === "watchlist")
        {
            triggerToast(t("movieListButton.addedToWatchlist"), "🍿" );
        }
        else if (action === "remove" && type === "watchlist")
        {
            triggerToast(t("movieListButton.removedFromWatchlist"), "🎬" );
        }
        else if (action === "add" && type === "favorites")
        {
            triggerToast(t("movieListButton.addedToFavorites"), "⭐" );
        }
        else if (action === "remove" && type === "favorites")
        {
            triggerToast(t("movieListButton.removedFromFavorites"), "🎞️" );
        }
        
        if ( onSuccess)
        {
            onSuccess();
        }

        } 
        catch (error) 
        {
        console.error(error);
        }
    };

    return (
        <button
            className="movie-list-button"
            onClick={handleClick}
        >
            {action === "add"
                ? t(`movieListButton.addTo${type === "watchlist" ? "Watchlist" : "Favorites"}`)
                : t(`movieListButton.removeFrom${type === "watchlist" ? "Watchlist" : "Favorites"}`)}
        </button>
    );
};

export default MovieListButton;