import React from 'react'

function RelationsList({
    title, list
}) {
    return (
        <div>
            <h2 className="smallTitle">
              {title} ({list.length})
            </h2>

            <ul>
              {list.map((itemAtual) => {
                return (
                  <li key={list.indexOf(itemAtual)}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={itemAtual.image} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
        </div>
    )
}

export default RelationsList
