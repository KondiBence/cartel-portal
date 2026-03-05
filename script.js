const { createApp, ref, reactive } = Vue;

createApp({
	setup() {
		const isAdmin    = ref(false);
		const adminUser  = ref('');
		const showLogin  = ref(false);
		const menuOpen   = ref(false);
		const loginUsername = ref('');
		const loginPassword = ref('');
		const loginError    = ref('');
		const onlineCount   = ref(2841);
		
		const showEditModal = ref(false);
		const editingId     = ref(null);
		const editForm = reactive({ title:'', desc:'', tag:'Háború', emoji:'📰', authorName:'', imagePreview: null });
		
		setInterval(() => { onlineCount.value += Math.floor(Math.random()*7)-3; }, 3000);
		
		const tagColorMap = { 'Háború':'red','Hatóság':'blue','Terület':'green','Üzlet':'','Esemény':'purple' };
		
		const news = ref([
			{
				id:1, emoji:'🔫', tag:'Háború', tagColor:'red', time:'12p',
				title:'Vérfürdő a Kikötőnegyedben — Los Muertos átvette az irányítást',
				desc:'Hajnali összecsapásokban legalább 6 bandatag vesztette életét. A terület mostantól a Los Muertos befolyási övezete.',
				author:{ name:'El Reportero', role:'Helyszíni tudósító', initials:'ER', bg:'#e74c3c' },
				views:'14.2e', comments:38
			},
			{
				id:2, emoji:'💰', tag:'Üzlet', tagColor:'', time:'45p',
				title:'Fekete piac: rekord forgalom a hétvégén',
				desc:'A városban keringő pénz mennyisége 40%-kal nőtt az elmúlt héten. Elemzők szerint új szállítmány érkezett.',
				author:{ name:'María Contadora', role:'Gazdasági szerkesztő', initials:'MC', bg:'#e8c14a' },
				views:'9.8e', comments:21
			},
			{
				id:3, emoji:'🚔', tag:'Hatóság', tagColor:'blue', time:'2ó',
				title:'Nagyszabású razzia — 12 őrizetbe vétel a Déli Negyedben',
				desc:'A rendőrség titokban szervezett akcióban csapott le több ismert személyre. Kik az ügynökök?',
				author:{ name:'Sombra', role:'Névtelen forrás', initials:'S', bg:'#9b59b6' },
				views:'22.5e', comments:94
			},
			{
				id:4, emoji:'🗺️', tag:'Terület', tagColor:'green', time:'4ó',
				title:'Új szövetség alakult — Vörös Kígyók és az Északi Klán tárgyalóasztalhoz ültek',
				desc:'Meglepő fordulat: a két rivális banda képviselői titkos találkozón vett részt. Mi lehet a tét?',
				author:{ name:'Don Periodista', role:'Főszerkesztő', initials:'DP', bg:'#2ecc71' },
				views:'31.0e', comments:117
			}
		]);
		
		let nextId = 100;
		
		function doLogin() {
			if (loginUsername.value.trim() === 'admin' && loginPassword.value === 'admin123') {
				isAdmin.value = true;
				adminUser.value = 'admin';
				showLogin.value = false;
				loginError.value = '';
				loginUsername.value = '';
				loginPassword.value = '';
			} else {
				loginError.value = 'Hibás felhasználónév vagy jelszó!';
			}
		}
		
		function closeLogin() {
			showLogin.value = false;
			loginError.value = '';
			loginUsername.value = '';
			loginPassword.value = '';
		}
		
		function logout() {
			isAdmin.value = false;
			adminUser.value = '';
		}
		
		function openCreate() {
			editingId.value = null;
			editForm.title = '';
			editForm.desc = '';
			editForm.tag = 'Háború';
			editForm.emoji = '📰';
			editForm.authorName = 'Admin';
			editForm.imagePreview = null;
			showEditModal.value = true;
		}
		
		function openEdit(item) {
			editingId.value = item.id;
			editForm.title = item.title;
			editForm.desc = item.desc;
			editForm.tag = item.tag;
			editForm.emoji = item.emoji;
			editForm.authorName = item.author.name;
			editForm.imagePreview = item.image || null;
			showEditModal.value = true;
		}
		
		function onImagePicked(e) {
			const file = e.target.files[0];
			if (!file) return;
			const reader = new FileReader();
			reader.onload = ev => { editForm.imagePreview = ev.target.result; };
			reader.readAsDataURL(file);
		}
		
		function removeImage() {
			editForm.imagePreview = null;
		}
		
		function saveNews() {
			if (!editForm.title.trim()) return;
			if (editingId.value !== null) {
				const idx = news.value.findIndex(n => n.id === editingId.value);
				if (idx !== -1) {
					news.value[idx] = {
						...news.value[idx],
						title: editForm.title,
						desc:  editForm.desc,
						tag:   editForm.tag,
						tagColor: tagColorMap[editForm.tag] ?? '',
						emoji: editForm.emoji,
						image: editForm.imagePreview || null,
						author: { ...news.value[idx].author, name: editForm.authorName }
					};
				}
			} else {
				const nm = editForm.authorName || 'Admin';
				const initials = nm.split(' ').map(w=>w[0]||'').join('').toUpperCase().slice(0,2) || 'AD';
				news.value.unshift({
					id: nextId++,
					emoji: editForm.emoji || '📰',
					image: editForm.imagePreview || null,
					tag: editForm.tag,
					tagColor: tagColorMap[editForm.tag] ?? '',
					time: 'most',
					title: editForm.title,
					desc:  editForm.desc,
					author: { name: nm, role: 'Adminisztrátor', initials, bg:'#e8c14a' },
					views: '0', comments: 0
				});
			}
			showEditModal.value = false;
		}
		
		function deleteNews(id) {
			if (confirm('Biztosan törlöd ezt a hírt?')) {
				news.value = news.value.filter(n => n.id !== id);
			}
		}
		
		return {
			isAdmin, adminUser, showLogin, menuOpen,
			loginUsername, loginPassword, loginError,
			onlineCount, news, showEditModal, editingId, editForm,
			doLogin, closeLogin, logout, openCreate, openEdit, saveNews, deleteNews,
			onImagePicked, removeImage
		};
	}
}).mount('#app');