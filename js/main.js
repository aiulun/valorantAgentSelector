// document.querySelector('button').addEventListener('click', getFetch)
const url = 'https://valorant-api.com/v1/agents';

const imagesContainer = document.querySelector('#optionSelect');
const h2 = document.querySelector('h2');
const abilityImages = document.querySelector('#ability-images');
const roles = document.querySelector('#roles');
const profile = document.querySelector('#full-profile');
const abilityDescrpitions = document.querySelector('#ability-description');

fetch(url)
  .then(res => res.json()) // parse response as JSON
  .then(data => {
    const valoData = data.data;
    const filteredData = valoData.filter(element => element.isPlayableCharacter == true)

    let valAgentData = new ValoAgent(filteredData);

    valAgentData.getPortrait();
    valAgentData.hideUnselected();
    valAgentData.getAgentProfile();

  })
  .catch(err => {
      console.log(`error ${err}`)
  });

// method that adds event listener to each image so if they're clicked, it'll display name, full body portrait and abilities

class ValoAgent {
  constructor (data) {
    this.data = data;
    // this.name = data.displayName;
    // this.image = image;
    // this.role = role;
    // this.abilities = abilities;
  }

  getAgentProfile() {
    const images = document.querySelectorAll('.portrait');
    [...images].forEach(element => {
      element.addEventListener('click', function() {
        fetch(`${url}/${element.id}`)
          .then(res => res.json()) // parse response as JSON
          .then(data => {
            h2.innerText = data.data.displayName.toUpperCase();
            profile.src = data.data.fullPortraitV2;
            console.log(data.data.abilities)
            abilityImages.innerHTML = '';
            data.data.abilities.forEach(element => {
              const abilityImage = document.createElement('img');
              const abilityDesc = document.createElement('h3');
              if (element.displayIcon == null) {
                return
              } else {
                abilityImage.src = element.displayIcon
                abilityImage.classList.add('ability-image')
                abilityImages.appendChild(abilityImage);
                abilityDesc.innerText = element.description;
                abilityImages.appendChild(abilityDesc);
              }
            })
        })
          .catch(err => {
            console.log(`error ${err}`)
        });
      })
    })
  }

  getAgentAbilities(data) {
    data.abilities.forEach(element => {
      const abilityImage = document.createElement('img');
      abilityImage.src = element.data.displayIcon
      abilityBio.appendChild(abilityImage);
    })
  }

  getPortrait() {
    this.data.map(element => {
      const img = document.createElement('img');
      img.src = element.displayIconSmall;
      img.classList.add(element.role.displayName, 'portrait');
      img.id = element.uuid;
      imagesContainer.appendChild(img);
    })

  }

  hideUnselected() {
    const duelistElements = document.querySelectorAll('.Duelist');
    const controllerElements = document.querySelectorAll('.Controller');
    const initiatorElements = document.querySelectorAll('.Initiator');
    const sentinelElements = document.querySelectorAll('.Sentinel');

    roles.addEventListener('change', function() {
      switch (roles.value) {
        case 'controller':
          [...controllerElements].forEach(element => element.classList.remove('hidden')),
          [...duelistElements].forEach(element => element.classList.add('hidden')),
          [...initiatorElements].forEach(element => element.classList.add('hidden')),
          [...sentinelElements].forEach(element => element.classList.add('hidden'));
          break;
        case 'duelist':
          [...duelistElements].forEach(element => element.classList.remove('hidden')),
          [...initiatorElements].forEach(element => element.classList.add('hidden')),
          [...sentinelElements].forEach(element => element.classList.add('hidden')),
          [...controllerElements].forEach(element => element.classList.add('hidden'));
          break;
        case 'initiator':
          [...initiatorElements].forEach(element => element.classList.remove('hidden')),
          [...sentinelElements].forEach(element => element.classList.add('hidden')),
          [...controllerElements].forEach(element => element.classList.add('hidden'));
          [...duelistElements].forEach(element => element.classList.add('hidden'))
          break;
        case 'sentinel':
          [...sentinelElements].forEach(element => element.classList.remove('hidden')),
          [...controllerElements].forEach(element => element.classList.add('hidden'));
          [...duelistElements].forEach(element => element.classList.add('hidden')),
          [...initiatorElements].forEach(element => element.classList.add('hidden'))
          break;
        default:
          [...sentinelElements].forEach(element => element.classList.remove('hidden')),
          [...controllerElements].forEach(element => element.classList.remove('hidden'));
          [...duelistElements].forEach(element => element.classList.remove('hidden')),
          [...initiatorElements].forEach(element => element.classList.remove('hidden'))
          break;
      }
    })
  }

}
