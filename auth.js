window.auth={
  user:null,
  async request(url,opts={}){const r=await fetch(url,{headers:{'Content-Type':'application/json',...(opts.headers||{})},...opts}),d=await r.json();if(!r.ok)throw Error(d.error||'Request failed');return d},
  async load(){const d=await this.request('/api/auth/me');this.user=d.user;this.paint()},
  paint(){const x=document.querySelector('#auth-area');x.innerHTML=this.user?`<b>${this.user.name}</b><button class="secondary" id="logout">Выйти</button>`:`<button class="secondary" id="signup">Регистрация</button><button class="primary" id="login">Войти</button>`;document.querySelector('#login')?.addEventListener('click',()=>this.open('login'));document.querySelector('#signup')?.addEventListener('click',()=>this.open('signup'));document.querySelector('#logout')?.addEventListener('click',async()=>{await this.request('/api/auth/logout',{method:'POST',headers:{'X-CSRF-Token':this.user.csrfToken}});this.user=null;this.paint()})},
  open(mode='login'){
    const isSignup=mode==='signup';
    document.querySelector('#modal-content').innerHTML=`<h2>${isSignup?'Создать аккаунт':'Войти в ImpactHub'}</h2><p>${isSignup?'Выберите роль и начните работать с задачами.':'Используйте email и пароль, с которыми зарегистрировались.'}</p><form id="auth-form"><label class="signup-only">Имя<input name="name" placeholder="Ваше имя или название команды" ${isSignup?'required':''}></label><label>Email<input required name="email" type="email" autocomplete="email"></label><label>Пароль<input required name="password" type="password" minlength="12" autocomplete="current-password" placeholder="Минимум 12 символов"></label><label class="signup-only">Роль<select name="role"><option value="business">Бизнес</option><option value="student">Студенческая команда</option></select></label><button class="primary wide">${isSignup?'Создать аккаунт':'Войти'}</button><p id="auth-error"></p><button class="auth-switch" type="button" id="switch-auth">${isSignup?'Уже есть аккаунт? Войти':'Нет аккаунта? Зарегистрироваться'}</button></form>`;
    document.querySelector('#modal').classList.remove('hidden');
    const form=document.querySelector('#auth-form');
    form.onsubmit=async e=>{e.preventDefault();try{const data=Object.fromEntries(new FormData(form));if(!isSignup){delete data.name;delete data.role}this.user=(await this.request('/api/auth/'+(isSignup?'signup':'login'),{method:'POST',body:JSON.stringify(data)})).user;this.paint();document.querySelector('#modal').classList.add('hidden')}catch(error){document.querySelector('#auth-error').textContent=error.message}};
    document.querySelector('#switch-auth').onclick=()=>this.open(isSignup?'login':'signup');
  }
};
window.auth.load().catch(()=>{window.auth.user=null;window.auth.paint()});
