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
            triggerToast("Movie added to watchlist !", "🍿" );
        }
        else if (action === "remove" && type === "watchlist")
        {
            triggerToast("Movie removed from watchlist !", "🎬" );
        }
        else if (action === "add" && type === "favorites")
        {
            triggerToast("Movie added to favorites !", "⭐" );
        }
        else if (action === "remove" && type === "favorites")
        {
            triggerToast("Movie removed from favorites !", "🎞️" );
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
            {action=== "add" ? `Add to ${type}` : `Remove from ${type}`}
        </button>
    );
};

export default MovieListButton;