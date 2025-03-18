// Book Club Manager JavaScript

// Data structure for books
const bookClubData = {
    books: [],
    members: [],
    discussions: []
};

// Navigation handling
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });

    loadBooks();
    loadMembers();
    console.log('Book Club Manager initialized');
});

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active-section');
        section.classList.add('hidden-section');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden-section');
        targetSection.classList.add('active-section');
    }
}

// Book management functions
function addBook() {
    const title = document.getElementById('book-title').value;
    const author = document.getElementById('book-author').value;
    const readingDate = document.getElementById('reading-date').value;

    if (!title || !author) {
        alert('Please fill in both title and author');
        return;
    }

    const book = {
        id: Date.now(),
        title: title,
        author: author,
        readingDate: readingDate || 'TBD',
        status: 'planned'
    };

    bookClubData.books.push(book);
    saveBooks();
    displayBooks();
    clearBookForm();
}

function displayBooks() {
    const bookItems = document.getElementById('book-items');
    bookItems.innerHTML = '';

    bookClubData.books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book-item';
        bookDiv.innerHTML = `
            <h4>${book.title}</h4>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Reading Date:</strong> ${book.readingDate}</p>
            <p><strong>Status:</strong> ${book.status}</p>
        `;
        bookItems.appendChild(bookDiv);
    });
}

function clearBookForm() {
    document.getElementById('book-title').value = '';
    document.getElementById('book-author').value = '';
    document.getElementById('reading-date').value = '';
}

function saveBooks() {
    localStorage.setItem('bookClubData', JSON.stringify(bookClubData));
}

function loadBooks() {
    const saved = localStorage.getItem('bookClubData');
    if (saved) {
        const data = JSON.parse(saved);
        bookClubData.books = data.books || [];
        displayBooks();
    }
}

// Member management functions
function addMember() {
    const name = document.getElementById('member-name').value;
    const email = document.getElementById('member-email').value;
    const role = document.getElementById('member-role').value;

    if (!name || !email) {
        alert('Please fill in both name and email');
        return;
    }

    // Simple email validation
    if (!email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }

    const member = {
        id: Date.now(),
        name: name,
        email: email,
        role: role,
        joinDate: new Date().toISOString().split('T')[0]
    };

    bookClubData.members.push(member);
    saveMembers();
    displayMembers();
    clearMemberForm();
}

function displayMembers() {
    const memberItems = document.getElementById('member-items');
    memberItems.innerHTML = '';

    bookClubData.members.forEach(member => {
        const memberDiv = document.createElement('div');
        memberDiv.className = 'member-item';
        memberDiv.innerHTML = `
            <div class="member-info">
                <h4>${member.name}</h4>
                <p><strong>Email:</strong> ${member.email}</p>
                <p><strong>Joined:</strong> ${member.joinDate}</p>
            </div>
            <span class="member-role ${member.role}">${member.role}</span>
        `;
        memberItems.appendChild(memberDiv);
    });
}

function clearMemberForm() {
    document.getElementById('member-name').value = '';
    document.getElementById('member-email').value = '';
    document.getElementById('member-role').value = 'member';
}

function saveMembers() {
    localStorage.setItem('bookClubData', JSON.stringify(bookClubData));
}

function loadMembers() {
    const saved = localStorage.getItem('bookClubData');
    if (saved) {
        const data = JSON.parse(saved);
        bookClubData.members = data.members || [];
        displayMembers();
    }
}