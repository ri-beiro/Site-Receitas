document.addEventListener('DOMContentLoaded', () => {
  
    const loginBtn = document.querySelector('.login-btn');
    const userInfoSpan = document.getElementById('user-info');
    const loginModal = document.getElementById('login-modal');
    const cadastroModal = document.getElementById('cadastro-modal');
    const profileModal = document.getElementById('profile-modal'); 
    const loginForm = document.getElementById('login-form');
    const cadastroForm = document.getElementById('cadastro-form');
    const userDropdown = document.getElementById('user-dropdown');
    const logoutBtn = document.getElementById('logout-btn');
    const viewProfileBtn = document.getElementById('view-profile-btn'); 

  
    const openModal = (modal) => modal.style.display = 'block';
    const closeModal = (modal) => modal.style.display = 'none';

    
    const setLoggedInUser = (username) => {
        localStorage.setItem('currentUser', username);
        userInfoSpan.innerText = username;
        
        loginBtn.removeEventListener('click', openLoginModal);
        loginBtn.addEventListener('click', toggleUserMenu);
    };

    const setLoggedOutUser = () => {
        localStorage.removeItem('currentUser');
        userInfoSpan.innerText = 'Login';
        
        loginBtn.removeEventListener('click', toggleUserMenu);
        loginBtn.addEventListener('click', openLoginModal);
    };

    const toggleUserMenu = (event) => {
        event.stopPropagation();
        userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
    };
    
    const openLoginModal = () => {
        closeModal(cadastroModal);
        openModal(loginModal);
    };

    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        setLoggedInUser(currentUser);
    } else {
        setLoggedOutUser();
    }
    
    const closeBtns = document.querySelectorAll('.modal .close-btn');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal);
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === loginModal) closeModal(loginModal);
        if (event.target === cadastroModal) closeModal(cadastroModal);
        if (event.target === profileModal) closeModal(profileModal);
        if (!event.target.closest('.user-container')) {
            userDropdown.style.display = 'none';
        }
    });

    document.getElementById('link-cadastro').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        openModal(cadastroModal);
    });

    document.getElementById('link-login').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(cadastroModal);
        openModal(loginModal);
    });


    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setLoggedOutUser();
        closeModal(userDropdown);
        alert('Você foi desconectado.');
    });


    viewProfileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const loggedInUser = localStorage.getItem('currentUser');
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};
        
        if (loggedInUser && usuarios[loggedInUser]) {
            const userData = usuarios[loggedInUser];
            document.getElementById('profile-username').innerText = loggedInUser;
            document.getElementById('profile-email').innerText = userData.email;
            document.getElementById('profile-phone').innerText = userData.phone;
            document.getElementById('profile-password').innerText = userData.password;
            
            closeModal(userDropdown);
            openModal(profileModal);
        } else {
            alert('Não foi possível carregar os dados do usuário.');
        }
    });



    cadastroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const phone = document.getElementById('reg-phone').value;
        const password = document.getElementById('reg-password').value;
        
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};
        if (usuarios[username]) {
            alert('Este usuário já existe. Por favor, escolha outro.');
            return;
        }


        usuarios[username] = {
            email: email,
            phone: phone,
            password: password
        };
        
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        alert('Cadastro realizado com sucesso!');
        closeModal(cadastroModal);
        setLoggedInUser(username);
    });


    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};

        if (usuarios[username] && usuarios[username].password === password) {
            alert('Login bem-sucedido!');
            closeModal(loginModal);
            setLoggedInUser(username);
        } else {
            alert('Nome de usuário ou senha incorretos.');
        }
    });
});