const app = document.querySelector('#app');

const routes = {
  '#/': homePage,
  '#/posts': postsPage,
  '#/user': userPage,
};
const apiUrl = 'https://jsonplaceholder.typicode.com';

const createEl = (el, attrs) =>
  Object.assign(document.createElement(el), attrs);

function renderRoute() {
  let path = window.location.hash;

  if (path.includes('#/user')) path = '#/user';
  else if (path.includes('#/posts')) path = '#/posts';
  else {
    path = '#/';
    window.location.hash = '#/';
  }
  const page = routes[path];

  page ? page() : console.error('404. page not found');
}

async function homePage() {
  try {
    const response = await fetch(`${apiUrl}/users`);
    const users = await response.json();

    app.innerHTML = '';
    const div = createEl('div', { id: 'home' });

    users.forEach((user, i) => {
      const button = createEl('button', {
        type: 'button',
        id: `btn-${i + 1}`,
        className: 'btn',
        innerText: user.name,
      });
      button.addEventListener('click', () => {
        window.location.hash = `#/user?id=${user.id}`;
      });
      div.append(button);
    });
    app.append(div);
  } catch (e) {
    console.error(e);
  }
}

async function userPage() {
  const id = parseInt(window.location.hash.match(/id=(\d+)/)[1]);

  try {
    const response = await fetch(`${apiUrl}/users?id=${id}`);
    const [user] = await response.json();

    const {
      name,
      username,
      company: { name: companyName, catchPhrase, bs },
      address: {
        street,
        suite,
        city,
        zipcode,
        geo: { lat, lng },
      },
      phone,
      email,
      website,
    } = user;

    app.innerHTML = '';
    const div = createEl('div', { id: 'user' });

    const htmlStructure = [
      {
        tag: {
          name: 'section',
          attrs: { id: 'info' },
          children: [
            {
              tag: { name: 'h1', attrs: { id: 'name', innerText: name } },
            },
            {
              tag: {
                name: 'h3',
                attrs: { id: 'username', innerText: `username: ${username}` },
              },
            },
          ],
        },
      },
      {
        tag: {
          name: 'section',
          attrs: { id: 'company' },
          children: [
            {
              tag: {
                name: 'h3',
                attrs: { id: 'company-name', innerText: companyName },
              },
            },
            {
              tag: {
                name: 'p',
                attrs: {
                  id: 'company-bs',
                  innerText: `business solutions: ${bs}`,
                },
              },
            },
            {
              tag: {
                name: 'p',
                attrs: {
                  id: 'company-catch-phrase',
                  innerText: `catchphrase: ${catchPhrase}`,
                },
              },
            },
          ],
        },
      },
      {
        tag: {
          name: 'section',
          attrs: { id: 'contacts' },
          children: [
            {
              tag: {
                name: 'p',
                attrs: {
                  id: 'address',
                  innerHTML: `Address: ${street}, ${suite}, ${city}, ${zipcode} <span>lat: ${lat} | long: ${lng}</span>`,
                },
              },
            },
            {
              tag: {
                name: 'p',
                attrs: { id: 'phone', innerText: `Tel: ${phone}` },
              },
            },
            {
              tag: {
                name: 'p',
                attrs: {
                  id: 'internet',
                  innerHTML: `${email} | <a href='https://www.${website}' target="_blank">${website}</a>`,
                },
              },
            },
          ],
        },
      },
    ];

    htmlStructure.forEach(({ tag }) => {
      const el = createEl(tag.name, tag.attrs);
      if (tag.children) {
        tag.children.forEach((child) => {
          const childEl = createEl(child.tag.name, child.tag.attrs);
          el.append(childEl);
        });
      }
      div.append(el);
    });

    const button = createEl('button', {
      type: 'button',
      id: 'btn-user',
      className: 'btn',
      innerText: 'view posts',
    });
    button.addEventListener('click', () => {
      window.location.hash = `#/posts?id=${id}&name=${name}`;
    });

    div.append(button);
    app.append(div);
  } catch (e) {
    console.error(e);
  }
}

async function postsPage() {
  const hash = window.location.hash;
  const id = parseInt(hash.match(/id=(\d+)/)[1]);
  const name = hash.split('&name=')[1].split('%20').join(' ');

  try {
    const response = await fetch(`${apiUrl}/posts?userId=${id}`);
    const posts = await response.json();

    app.innerHTML = '';
    const div = createEl('div', { id: 'posts' });
    const h1 = createEl('h1', { id: 'title', innerText: `Posts by ${name}` });

    div.append(h1);

    posts.forEach((post) => {
      const section = createEl('section', { id: `post-${post.id}` });
      const h2 = createEl('h2', {
        id: `post-title-${post.id}`,
        innerText: post.title,
      });
      const p = createEl('p', {
        id: `post-content-${post.id}`,
        innerText: post.body,
      });

      section.append(h2, p);
      div.append(section);
    });
    app.append(div);
  } catch (e) {
    console.error(e);
  }
}

window.addEventListener('hashchange', renderRoute);
renderRoute();
