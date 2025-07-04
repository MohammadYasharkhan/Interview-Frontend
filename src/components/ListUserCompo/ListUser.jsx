import './ListUser.css'
import { useUserContext } from '../../Context/StoreContext';
import { useState,useEffect } from 'react';
import Card from '../card/card';

function ListUser() {
    const [users, setUsers] = useState([]);
    const { refreshCount } = useUserContext();

    useEffect(() => {
        fetch('http://localhost:4000/api/fetchList')
            .then(res => res.json())
            .then(data => { console.log(data) ; setUsers(data.data)})
            .catch(err => console.error(err));
    }, [refreshCount]);

    return <div className='List-User-Container'>
        {users.map(users=>(
            <Card image={users.imageURL} name={users.fullName} email={users.email}/>
        ))}
    </div>
}
export default ListUser;