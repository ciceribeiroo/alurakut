import React, { useEffect } from 'react'
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import RelationsList from '../src/components/RelationsList';

function ProfileSidebar(propriedades) {
  return (
    <Box>
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr/>
      
      <p>
      <a href={`https://github.com/${propriedades.githubUser}`} className="boxLink">
        @{propriedades.githubUser}
      </a>
      </p>

      <hr/>

      <AlurakutProfileSidebarMenuDefault></AlurakutProfileSidebarMenuDefault>
    </Box>
  )
}

export default function Home(props) {
  const usuarioAleatorio = props.githubUser;
  const [comunidades, setComunidades] = React.useState([]);
  const pessoasFavoritas = [
    {title: 'juunegreiros', image: `https://github.com/juunegreiros.png`},
    {title: 'juunegreiros', image: `https://github.com/juunegreiros.png`},
    {title: 'juunegreiros', image: `https://github.com/juunegreiros.png`},
    {title: 'juunegreiros', image: `https://github.com/juunegreiros.png`},
    {title: 'juunegreiros', image: `https://github.com/juunegreiros.png`},
    {title: 'juunegreiros', image: `https://github.com/juunegreiros.png`},
  ];
  const [seguidores, setSeguidores] = React.useState([]);
  const [segParaAparecer, setSegParaAparecer] = React.useState([]);
  React.useEffect(function() {
    fetch('https://api.github.com/users/ciceribeiroo/followers')
    .then(function (respostaDoServidor) {
      return respostaDoServidor.json();
    })
    .then(function(respostaCompleta) {
      setSeguidores(respostaCompleta);
      setSegParaAparecer(respostaCompleta.slice(0,6))
    })

    fetch('https://graphql.datocms.com/', {
      method:'POST',
      headers: {
        'Authorization': '78cacb3c4c15c4451b8339cbfcc4cc',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ "query": `query {
        allCommunities {
          id 
          title
          imageUrl
          creatorSlug
        }
      }` })
    })
    .then((response)=>response.json())
    .then((respostaCompleta) =>{
      const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
      setComunidades(comunidadesVindasDoDato)
    })
  }, [])

  return (
    <>
      <AlurakutMenu githubUser={usuarioAleatorio} />
      <MainGrid>
        {/* <Box style="grid-area: profileArea;"> */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a) 
            </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={
              function handleCriaComunidade(e){
                e.preventDefault();
                console.log("aqui")
                const dadosForm = new FormData(e.target);
                
                const comunidade = {
                  title: dadosForm.get('title'),
                  imageUrl: dadosForm.get('image'),
                  creatorSlug: usuarioAleatorio,
                }

                if(comunidade.title.trim() === ""){
                  alert("Adicione um titulo")
                  return;
                }
                if(comunidade.imageUrl.trim() === ""){
                  comunidade.imagem = "https://picsum.photos/200"
                }

                fetch('/api/comunidades', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(comunidade)
                })
                .then(async (response) => {
                  const dados = await response.json();
                  console.log(dados.registroCriado);
                  const comunidade = dados.registroCriado;
                  const comunidadesAtt = [...comunidades, comunidade]
                  setComunidades(comunidadesAtt)
                })
            }}>
              <div>
                <input placeholder="Qual vai ser o nome da sua comunidade?" 
                name="title" 
                aria-label="Qual vai ser o nome da sua comunidade?" 
                type="text"/>
              </div>
              <div>
                <input placeholder="Coloque uma URL para usarmos de capa" 
                name="image" 
                aria-label="Coloque uma URL para usarmos de capa" 
                type="text"/>
              </div>
              <button>
                Criar Comunidade
              </button>
            </form>
          </Box>

        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
        
        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
              Seguidores ({seguidores.length})
            </h2>
          <ul>
              {segParaAparecer.map((itemAtual) => {
                return (
                  
                  <li key={segParaAparecer.indexOf(itemAtual)}>
                    <a href={`/users/${itemAtual.title}`}>
                      <img src={itemAtual.avatar_url} alt="Capa Comunidade" />
                      <span>{itemAtual.login}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
            <a href="#">Ver mais</a>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
          <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} alt="Capa Comunidade" />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <RelationsList title="Pessoas Favoritas" list={pessoasFavoritas}></RelationsList>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}
export async function getServerSideProps(context) {
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN;
  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
        Authorization: token
      }
  })
  .then((resposta) => resposta.json())

  if(!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token);
  return {
    props: {
      githubUser
    }, // will be passed to the page component as props
  }
}