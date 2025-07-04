import './card.css'

function Card(props)
{
    return <div className='card-conatiner'>
        <img src={props.image} alt="image" />
        <div className='Details'>
            <p>{props.name}</p>
            <p>{props.email}</p>
        </div>
    </div>
}

export default Card;