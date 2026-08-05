import "./FollowsButton.css";

interface Props 
{
  userId: number;
  action: "follow" | "unfollow";
}

const FollowsButton = ({ userId, action }: Props) => 
{
    const handleClick = async () => 
    {
        const token = localStorage.getItem("token");
        const method = action === "follow" ? "POST" : "DELETE";

        try 
        {
            const res = await fetch(`/api/follows/${userId}`, 
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
        className="follow-button"
        onClick={handleClick}
        >
            {action=== "follow" ? "Follow" : "Unfollow"}
        </button>
    );
};

export default FollowsButton;