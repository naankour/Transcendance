import { useState, useEffect } from 'react'
import axios from 'axios'

const Follows = () => {
  const [follows, setFollows] = useState([])

  useEffect(() => {
    axios.get('/api/follows')
      .then(res => setFollows(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <h1>Mes Follows</h1>
      {follows.map((item: any) => (
        <div key={item.id}>
          <p>User ID suivi : {item.followed_id}</p>
        </div>
      ))}
    </div>
  )
}

export default Follows