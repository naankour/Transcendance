import { useState } from "react";
import "./MovieListButton.css";

interface Props 
{
  movieId: number;
  type: "watchlist" | "favorites";
  action: "add" | "remove";
}

const MovieListButton = ({ movieId, type, action }: Props) => 
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
            throw new Error(`Error ${res.status}`);
        }

        window.location.reload();

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