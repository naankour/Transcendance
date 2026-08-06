import "./FollowsButton.css";

interface Props 
{
    userId: number;
    action: "follow" | "unfollow";
    triggerToast: (message: string, icon?: string) => void;
    onSuccess?: () => void;
}

const FollowsButton = ({userId, action, triggerToast, onSuccess}: Props) => 
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
            const data = await res.json();
            if (res.status === 409)
            {
                triggerToast(data.error, "⚠️");
                return;
            }
            throw new Error(`Error ${res.status}`);
        }

        if (action === "follow")
        {
            triggerToast("You followed this user", "💖" );
        }
        else
        {
            triggerToast("You unfollowed this user", "💔" );
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
            className="follow-button"
            onClick={handleClick}
        >
            {action=== "follow" ? "Follow" : "Unfollow"}
        </button>
    );
};

export default FollowsButton;