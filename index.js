let user = localStorage.hasOwnProperty('users')
if (user) {
    play1.style = 'pointer-events: avilable';
    play2.style = 'pointer-events: avilable';
    let users = JSON.parse(localStorage.getItem('users'));
    let objects = JSON.parse(localStorage.getItem('objects'));
    navbarul.innerHTML += `
                <li class="nav-item" id='userid'>
                    <a class="nav-link">${users.username}</a>
                </li>
            `
    navbar.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" onclick="logout()">Log Out</a>
                </li>
            `
    function logout() {
        for (let i in objects) {
            if (atob(objects[i].email) == atob(users.email)) {
                objects.splice(i, 1);
            }
            play1.style = 'pointer-events: none';
            play2.style = 'pointer-events: none';
        }
        userid.style = 'display: none';
        localStorage.setItem('objects', JSON.stringify(objects));
        localStorage.removeItem('users');
        navbar.innerHTML = `
                    <li class="nav-item" >
                        <a class="nav-link" href="html/login.html">Log in</a>
                    </li >
                    <li class="nav-item">
                        <a class="nav-link" href="html/register.html">Sign up</a>
                    </li>
                `;
    }
} else {
    play1.style = 'pointer-events: none';
    play2.style = 'pointer-events: none';
}