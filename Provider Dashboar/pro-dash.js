document.addEventListener("DOMContentLoaded", function () {
  // User data object to keep information synchronized
  const userData = {
    name: "আপনার নাম",
    email: "yourname@example.com",
    phone: "০১৭১২৩৪৫৬৭৮",
    profession: "ইলেকট্রিশিয়ান",
    experience: "৫ বছর",
    areas: "ঢাকা, নারায়ণগঞ্জ, গাজীপুর",
    about:
      "আমি একজন দক্ষ ও প্রশিক্ষিত ইলেকট্রিশিয়ান। ৫ বছরের বেশি অভিজ্ঞতা রয়েছে ঘরোয়া ও বাণিজ্যিক ইলেকট্রিক্যাল কাজে। সৎ ও বিশ্বস্তভাবে কাজ করাই আমার নীতি।",
    profileImage: "/ShebaXpert/Resources/images/default-profile.png",
  };

  // Mobile menu toggle
  const mobileMenuBtn = document.createElement("div");
  mobileMenuBtn.className = "mobile-menu-btn";
  mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
  document.querySelector(".header-left").prepend(mobileMenuBtn);

  mobileMenuBtn.addEventListener("click", function () {
    document.querySelector(".sidebar").classList.toggle("active");
  });

  // Navigation functionality
  const navItems = document.querySelectorAll(".nav-menu li");

  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove active class from all items
      navItems.forEach((i) => i.classList.remove("active"));

      // Add active class to clicked item
      this.classList.add("active");

      // Get the link target
      const target = this.querySelector("a").getAttribute("href").substring(1);

      // Load content based on selection
      loadContent(target);

      // Close sidebar on mobile after selection
      if (window.innerWidth < 992) {
        document.querySelector(".sidebar").classList.remove("active");
      }
    });
  });

  // Content loader function
  function loadContent(page) {
    const mainContent = document.querySelector(".main-content");
    const headerTitle = document.querySelector(".header-left h2");

    // Hide all sections first
    const sections = document.querySelectorAll(".dashboard-content > div");
    sections.forEach((section) => {
      section.style.display = "none";
    });

    switch (page) {
      case "dashboard":
        headerTitle.textContent = "ড্যাশবোর্ড";
        showDashboard();
        break;

      case "profile":
        headerTitle.textContent = "প্রোফাইল";
        showProfile();
        break;

      case "appointment":
        headerTitle.textContent = "অ্যাপয়েন্টমেন্ট";
        showAppointments();
        break;

      case "message":
        headerTitle.textContent = "মেসেজ";
        showMessages();
        break;

      case "settings":
        headerTitle.textContent = "সেটিংস";
        showSettings();
        break;

      case "logout":
        handleLogout();
        break;

      default:
        headerTitle.textContent = "ড্যাশবোর্ড";
        showDashboard();
    }

    // Update user name in header
    updateUserName();
  }

  // Update user name in header
  function updateUserName() {
    const userNameElements = document.querySelectorAll(".user-name");
    userNameElements.forEach((element) => {
      element.textContent = userData.name;
    });

    const profileImageElements = document.querySelectorAll(
      ".profile-image img, .user-profile img"
    );
    profileImageElements.forEach((element) => {
      element.src = userData.profileImage;
      element.alt = userData.name;
    });
  }

  // Dashboard content
  function showDashboard() {
    const dashboardContent = document.querySelector(".dashboard-content");
    dashboardContent.innerHTML = `
            <!-- Stats Cards -->
            <div class="stats-cards">
                <div class="card">
                    <div class="card-icon bg-blue">
                        <i class="fas fa-phone"></i>
                    </div>
                    <div class="card-info">
                        <h3>কল রিকুয়েস্ট</h3>
                        <p>১৫</p>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-icon bg-green">
                        <i class="fas fa-comment"></i>
                    </div>
                    <div class="card-info">
                        <h3>মেসেজ</h3>
                        <p>২৩</p>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-icon bg-orange">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="card-info">
                        <h3>রেটিং</h3>
                        <p>৪.৮/৫</p>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-icon bg-purple">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div class="card-info">
                        <h3>সার্ভিস এরিয়া</h3>
                        <p>৫ টি</p>
                    </div>
                </div>
            </div>
            
            <!-- Main Sections -->
            <div class="main-sections">
                <!-- Notifications Section -->
                <div class="section">
                    <div class="section-header">
                        <h3><i class="fas fa-bell"></i> নোটিফিকেশন</h3>
                        <a href="#" class="see-all">সব দেখুন</a>
                    </div>
                    <div class="notification-list">
                        <div class="notification-item">
                            <div class="notification-icon">
                                <i class="fas fa-comment"></i>
                            </div>
                            <div class="notification-content">
                                <p>রহিম আপনাকে একটি মেসেজ পাঠিয়েছেন</p>
                                <span class="time">১০ মিনিট আগে</span>
                            </div>
                        </div>
                        
                        <div class="notification-item">
                            <div class="notification-icon">
                                <i class="fas fa-phone"></i>
                            </div>
                            <div class="notification-content">
                                <p>করিম আপনাকে কল করেছেন</p>
                                <span class="time">৩০ মিনিট আগে</span>
                            </div>
                        </div>
                        
                        <div class="notification-item">
                            <div class="notification-icon">
                                <i class="fas fa-star"></i>
                            </div>
                            <div class="notification-content">
                                <p>আপনি একজন নতুন কাস্টমার থেকে ৫ স্টার রেটিং পেয়েছেন</p>
                                <span class="time">২ ঘন্টা আগে</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Service Areas Section -->
                <div class="section">
                    <div class="section-header">
                        <h3><i class="fas fa-map-marked-alt"></i> সার্ভিস এরিয়া</h3>
                    </div>
                    <div class="service-areas">
                        <div class="area-tag">ঢাকা</div>
                        <div class="area-tag">নারায়ণগঞ্জ</div>
                        <div class="area-tag">গাজীপুর</div>
                        <div class="area-tag">সাভার</div>
                        <div class="area-tag">কেরাণীগঞ্জ</div>
                    </div>
                </div>
            </div>
            
            <!-- Reviews Section -->
            <div class="section full-width">
                <div class="section-header">
                    <h3><i class="fas fa-comment-dots"></i> ব্যবহারকারীদের রিভিউ</h3>
                    <a href="#" class="see-all">সব দেখুন</a>
                </div>
                <div class="reviews">
                    <div class="review-item">
                        <div class="reviewer">
                            <img src="/ShebaXpert/Resources/images/man2.png" alt="ব্যবহারকারী">
                            <div class="reviewer-info">
                                <h4>আব্দুল্লাহ আল মামুন</h4>
                                <div class="rating">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star-half-alt"></i>
                                    <span>৪.৫</span>
                                </div>
                            </div>
                        </div>
                        <div class="review-text">
                            <p>খুব ভালো সার্ভিস পেয়েছি। সময়মতো কাজ শেষ করেছেন এবং দামও যুক্তিসঙ্গত। পরবর্তীতেও আপনার সেবা নিবো ইনশাআল্লাহ।</p>
                        </div>
                        <div class="review-date">
                            ১০ দিন আগে
                        </div>
                    </div>
                    
                    <div class="review-item">
                        <div class="reviewer">
                            <img src="/ShebaXpert/Resources/images/woman1.jpeg" alt="ব্যবহারকারী">
                            <div class="reviewer-info">
                                <h4>ফারহানা ইয়াসমিন</h4>
                                <div class="rating">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <span>৫.০</span>
                                </div>
                            </div>
                        </div>
                        <div class="review-text">
                            <p>অসাধারণ কাজ! আমি খুবই সন্তুষ্ট। আপনার কাজের মান এবং আচরণ দুটোই প্রশংসনীয়। সবাইকে আপনার সেবা নেওয়ার পরামর্শ দিবো।</p>
                        </div>
                        <div class="review-date">
                            ৩ দিন আগে
                        </div>
                    </div>
                </div>
            </div>
        `;

    // Initialize dashboard functionality
    initDashboard();
  }

  // Profile content - Redesigned
  function showProfile() {
    const dashboardContent = document.querySelector(".dashboard-content");
    dashboardContent.innerHTML = `
           <div class="profile-section">
  <div class="profile-header">
    <div class="profile-image-container">
      <div class="profile-image">
        <img src="${userData.profileImage}" alt="প্রোফাইল ছবি">
        <button class="edit-icon" id="change-profile-pic">
          <i class="fas fa-camera"></i>
        </button>
      </div>
    </div>

    <h2 class="user-name">${userData.name}</h2>

    <div class="rating">
      <i class="fas fa-star"></i>
      <i class="fas fa-star"></i>
      <i class="fas fa-star"></i>
      <i class="fas fa-star"></i>
      <i class="fas fa-star-half-alt"></i>
      <span>৪.৭ (১২৩ রিভিউ)</span>
    </div>

    <p class="expert-type">${userData.profession}</p>

    <div class="profile-tabs">
      <div class="tab active" data-tab="personal">ব্যক্তিগত তথ্য</div>
      <div class="tab" data-tab="professional">পেশাগত তথ্য</div>
      <div class="tab" data-tab="about">সম্পর্কে</div>
    </div>
  </div>

  <div class="profile-content">
    <div class="tab-content active" id="personal">
      <div class="detail-item">
        <label>নাম:</label>
        <div class="detail-value" id="profile-name">${userData.name}</div>
        <button class="edit-btn" id="edit-name"><i class="fas fa-edit"></i></button>
      </div>
      <div class="detail-item">
        <label>ইমেইল:</label>
        <div class="detail-value" id="profile-email">${userData.email}</div>
        <button class="edit-btn" id="edit-email"><i class="fas fa-edit"></i></button>
      </div>
      <div class="detail-item">
        <label>ফোন:</label>
        <div class="detail-value" id="profile-phone">${userData.phone}</div>
        <button class="edit-btn" id="edit-phone"><i class="fas fa-edit"></i></button>
      </div>
    </div>

    <div class="tab-content" id="professional">
      <div class="detail-item">
        <label>পেশা:</label>
        <div class="detail-value" id="profile-profession">${userData.profession}</div>
        <button class="edit-btn" id="edit-profession"><i class="fas fa-edit"></i></button>
      </div>
      <div class="detail-item">
        <label>অভিজ্ঞতা:</label>
        <div class="detail-value" id="profile-experience">${userData.experience}</div>
        <button class="edit-btn" id="edit-experience"><i class="fas fa-edit"></i></button>
      </div>
      <div class="detail-item">
        <label>সার্ভিস এরিয়া:</label>
        <div class="detail-value" id="profile-areas">${userData.areas}</div>
        <button class="edit-btn" id="edit-areas"><i class="fas fa-edit"></i></button>
      </div>
    </div>

    <div class="tab-content" id="about">
      <div class="about-content">
        <div class="detail-value" id="profile-about">${userData.about}</div>
        <button class="edit-btn" id="edit-about"><i class="fas fa-edit"></i></button>
      </div>
    </div>
  </div>
</div>
        `;

    // Initialize profile tabs
    const profileTabs = document.querySelectorAll(".profile-tabs .tab");
    profileTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        profileTabs.forEach((t) => t.classList.remove("active"));
        this.classList.add("active");

        const tabId = this.getAttribute("data-tab");
        document
          .querySelectorAll(".profile-content .tab-content")
          .forEach((content) => {
            content.classList.remove("active");
          });
        document.getElementById(tabId).classList.add("active");
      });
    });

    // Change profile picture
    document
      .getElementById("change-profile-pic")
      .addEventListener("click", function () {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              userData.profileImage = event.target.result;
              document.querySelector(".profile-image img").src =
                event.target.result;
              updateUserName();
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
      });

    // Edit name
    document.getElementById("edit-name").addEventListener("click", function () {
      const nameElement = document.getElementById("profile-name");
      const currentName = nameElement.textContent;

      nameElement.innerHTML = `<input type="text" id="edit-name-input" value="${currentName}">`;

      const saveBtn = document.createElement("button");
      saveBtn.className = "save-btn";
      saveBtn.innerHTML = '<i class="fas fa-save"></i>';
      saveBtn.onclick = function () {
        const newName = document.getElementById("edit-name-input").value;
        nameElement.textContent = newName;
        userData.name = newName;
        updateUserName();
        this.remove();
        document.getElementById("edit-name").style.display = "inline-block";
      };

      this.style.display = "none";
      this.parentNode.appendChild(saveBtn);
    });

    // Edit email
    document
      .getElementById("edit-email")
      .addEventListener("click", function () {
        const emailElement = document.getElementById("profile-email");
        const currentEmail = emailElement.textContent;

        emailElement.innerHTML = `<input type="email" id="edit-email-input" value="${currentEmail}">`;

        const saveBtn = document.createElement("button");
        saveBtn.className = "save-btn";
        saveBtn.innerHTML = '<i class="fas fa-save"></i>';
        saveBtn.onclick = function () {
          const newEmail = document.getElementById("edit-email-input").value;
          emailElement.textContent = newEmail;
          userData.email = newEmail;
          this.remove();
          document.getElementById("edit-email").style.display = "inline-block";
        };

        this.style.display = "none";
        this.parentNode.appendChild(saveBtn);
      });

    // Edit phone
    document
      .getElementById("edit-phone")
      .addEventListener("click", function () {
        const phoneElement = document.getElementById("profile-phone");
        const currentPhone = phoneElement.textContent;

        phoneElement.innerHTML = `<input type="tel" id="edit-phone-input" value="${currentPhone}">`;

        const saveBtn = document.createElement("button");
        saveBtn.className = "save-btn";
        saveBtn.innerHTML = '<i class="fas fa-save"></i>';
        saveBtn.onclick = function () {
          const newPhone = document.getElementById("edit-phone-input").value;
          phoneElement.textContent = newPhone;
          userData.phone = newPhone;
          this.remove();
          document.getElementById("edit-phone").style.display = "inline-block";
        };

        this.style.display = "none";
        this.parentNode.appendChild(saveBtn);
      });

    // Edit profession
    document
      .getElementById("edit-profession")
      .addEventListener("click", function () {
        const professionElement = document.getElementById("profile-profession");
        const currentProfession = professionElement.textContent;

        const select = document.createElement("select");
        select.id = "edit-profession-select";
        ["ইলেকট্রিশিয়ান", "প্লাম্বার", "এসি টেকনিশিয়ান", "ক্লিনার"].forEach(
          (opt) => {
            const option = document.createElement("option");
            option.value = opt;
            option.textContent = opt;
            if (opt === currentProfession) option.selected = true;
            select.appendChild(option);
          }
        );

        professionElement.innerHTML = "";
        professionElement.appendChild(select);

        const saveBtn = document.createElement("button");
        saveBtn.className = "save-btn";
        saveBtn.innerHTML = '<i class="fas fa-save"></i>';
        saveBtn.onclick = function () {
          const newProfession = document.getElementById(
            "edit-profession-select"
          ).value;
          professionElement.textContent = newProfession;
          userData.profession = newProfession;
          document.querySelector(".expert-type").textContent = newProfession;
          this.remove();
          document.getElementById("edit-profession").style.display =
            "inline-block";
        };

        this.style.display = "none";
        this.parentNode.appendChild(saveBtn);
      });

    // Edit experience
    document
      .getElementById("edit-experience")
      .addEventListener("click", function () {
        const experienceElement = document.getElementById("profile-experience");
        const currentExperience = experienceElement.textContent;

        experienceElement.innerHTML = `<input type="text" id="edit-experience-input" value="${currentExperience}">`;

        const saveBtn = document.createElement("button");
        saveBtn.className = "save-btn";
        saveBtn.innerHTML = '<i class="fas fa-save"></i>';
        saveBtn.onclick = function () {
          const newExperience = document.getElementById(
            "edit-experience-input"
          ).value;
          experienceElement.textContent = newExperience;
          userData.experience = newExperience;
          this.remove();
          document.getElementById("edit-experience").style.display =
            "inline-block";
        };

        this.style.display = "none";
        this.parentNode.appendChild(saveBtn);
      });

    // Edit service areas
    document
      .getElementById("edit-areas")
      .addEventListener("click", function () {
        const areasElement = document.getElementById("profile-areas");
        const currentAreas = areasElement.textContent;

        areasElement.innerHTML = `<input type="text" id="edit-areas-input" value="${currentAreas}">`;

        const saveBtn = document.createElement("button");
        saveBtn.className = "save-btn";
        saveBtn.innerHTML = '<i class="fas fa-save"></i>';
        saveBtn.onclick = function () {
          const newAreas = document.getElementById("edit-areas-input").value;
          areasElement.textContent = newAreas;
          userData.areas = newAreas;
          this.remove();
          document.getElementById("edit-areas").style.display = "inline-block";
        };

        this.style.display = "none";
        this.parentNode.appendChild(saveBtn);
      });

    // Edit about section
    document
      .getElementById("edit-about")
      .addEventListener("click", function () {
        const aboutElement = document.getElementById("profile-about");
        const currentAbout = aboutElement.textContent;

        aboutElement.innerHTML = `<textarea id="edit-about-text" rows="4">${currentAbout}</textarea>`;

        const saveBtn = document.createElement("button");
        saveBtn.className = "save-btn";
        saveBtn.innerHTML = '<i class="fas fa-save"></i>';
        saveBtn.onclick = function () {
          const newAbout = document.getElementById("edit-about-text").value;
          aboutElement.textContent = newAbout;
          userData.about = newAbout;
          this.remove();
          document.getElementById("edit-about").style.display = "inline-block";
        };

        this.style.display = "none";
        this.parentNode.appendChild(saveBtn);
      });
  }

  // Appointments content with detailed view
  function showAppointments() {
    const dashboardContent = document.querySelector(".dashboard-content");
    dashboardContent.innerHTML = `
            <div class="appointments-section">
                <div class="section-header">
                    <h2><i class="fas fa-calendar-alt"></i> অ্যাপয়েন্টমেন্ট ব্যবস্থাপনা</h2>
                    <div class="header-actions">
                        <div class="filter-container">
                            <select id="appointment-filter" class="filter-select">
                                <option value="all">সব অ্যাপয়েন্টমেন্ট</option>
                                <option value="today">আজকের</option>
                                <option value="upcoming">আসন্ন</option>
                                <option value="completed">সম্পন্ন</option>
                                <option value="cancelled">বাতিল</option>
                            </select>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        <button class="btn primary-btn" id="new-appointment-btn"><i class="fas fa-plus"></i> নতুন অ্যাপয়েন্টমেন্ট</button>
                    </div>
                </div>
                
                <div class="appointments-container">
                    <div class="appointments-summary">
                        <div class="summary-card">
                            <div class="summary-icon pending">
                                <i class="fas fa-clock"></i>
                            </div>
                            <div class="summary-info">
                                <h3>মোট অ্যাপয়েন্টমেন্ট</h3>
                                <p>২৫</p>
                            </div>
                        </div>
                        
                        <div class="summary-card">
                            <div class="summary-icon confirmed">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <div class="summary-info">
                                <h3>নিশ্চিতকৃত</h3>
                                <p>১৮</p>
                            </div>
                        </div>
                        
                        <div class="summary-card">
                            <div class="summary-icon completed">
                                <i class="fas fa-calendar-check"></i>
                            </div>
                            <div class="summary-info">
                                <h3>সম্পন্ন</h3>
                                <p>১৫</p>
                            </div>
                        </div>
                        
                        <div class="summary-card">
                            <div class="summary-icon cancelled">
                                <i class="fas fa-times-circle"></i>
                            </div>
                            <div class="summary-info">
                                <h3>বাতিল</h3>
                                <p>২</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="appointments-list">
                        <div class="list-header">
                            <div class="header-item">ক্লায়েন্ট</div>
                            <div class="header-item">সেবা</div>
                            <div class="header-item">তারিখ ও সময়</div>
                            <div class="header-item">অবস্থা</div>
                            <div class="header-item">অ্যাকশন</div>
                        </div>
                        
                        <div class="appointment-item confirmed" data-id="1">
                            <div class="client-info">
                                <img src="/ShebaXpert/Resources/images/man3.jpg" alt="ক্লায়েন্ট">
                                <div>
                                    <h4>আব্দুল্লাহ আল মামুন</h4>
                                    <p><i class="fas fa-map-marker-alt"></i> মিরপুর, ঢাকা</p>
                                </div>
                            </div>
                            <div class="service-info">
                                <i class="fas fa-bolt"></i>
                                <span>ইলেকট্রিক্যাল মেরামত</span>
                            </div>
                            <div class="time-info">
                                <div class="date">আগামীকাল, ১০:০০ AM</div>
                                <div class="duration"><i class="fas fa-clock"></i> ২ ঘন্টা</div>
                            </div>
                            <div class="status-badge confirmed">
                                <i class="fas fa-check-circle"></i>
                                <span>নিশ্চিতকৃত</span>
                            </div>
                            <div class="action-buttons">
                                <button class="btn action-btn view-btn" title="বিস্তারিত দেখুন"><i class="fas fa-eye"></i></button>
                                <button class="btn action-btn chat-btn" title="চ্যাট করুন"><i class="fas fa-comment"></i></button>
                                <button class="btn action-btn reschedule-btn" title="সময় পরিবর্তন"><i class="fas fa-calendar-alt"></i></button>
                                <button class="btn action-btn cancel-btn" title="বাতিল করুন"><i class="fas fa-times"></i></button>
                            </div>
                        </div>
                        
                        <div class="appointment-item pending" data-id="2">
                            <div class="client-info">
                                <img src="/ShebaXpert/Resources/images/woman1.jpeg" alt="ক্লায়েন্ট">
                                <div>
                                    <h4>ফারহানা ইয়াসমিন</h4>
                                    <p><i class="fas fa-map-marker-alt"></i> উত্তরা, ঢাকা</p>
                                </div>
                            </div>
                            <div class="service-info">
                                <i class="fas fa-lightbulb"></i>
                                <span>লাইট ফিক্সিং</span>
                            </div>
                            <div class="time-info">
                                <div class="date">১৫ই জুন, ২:০০ PM</div>
                                <div class="duration"><i class="fas fa-clock"></i> ১ ঘন্টা</div>
                            </div>
                            <div class="status-badge pending">
                                <i class="fas fa-clock"></i>
                                <span>পেন্ডিং</span>
                            </div>
                            <div class="action-buttons">
                                <button class="btn action-btn confirm-btn" title="নিশ্চিত করুন"><i class="fas fa-check"></i></button>
                                <button class="btn action-btn reschedule-btn" title="সময় পরিবর্তন"><i class="fas fa-calendar-alt"></i></button>
                                <button class="btn action-btn cancel-btn" title="বাতিল করুন"><i class="fas fa-times"></i></button>
                            </div>
                        </div>
                        
                        <div class="appointment-item completed" data-id="3">
                            <div class="client-info">
                                <img src="/ShebaXpert/Resources/images/man2.png" alt="ক্লায়েন্ট">
                                <div>
                                    <h4>রহিম উদ্দিন</h4>
                                    <p><i class="fas fa-map-marker-alt"></i> ধানমন্ডি, ঢাকা</p>
                                </div>
                            </div>
                            <div class="service-info">
                                <i class="fas fa-fan"></i>
                                <span>ফ্যান ইনস্টলেশন</span>
                            </div>
                            <div class="time-info">
                                <div class="date">১০ই জুন, ১১:০০ AM</div>
                                <div class="duration"><i class="fas fa-clock"></i> ১.৫ ঘন্টা</div>
                            </div>
                            <div class="status-badge completed">
                                <i class="fas fa-check-circle"></i>
                                <span>সম্পন্ন</span>
                            </div>
                            <div class="action-buttons">
                                <button class="btn action-btn review-btn" title="রিভিউ দেখুন"><i class="fas fa-star"></i></button>
                                <button class="btn action-btn invoice-btn" title="ইনভয়েস"><i class="fas fa-file-invoice"></i></button>
                                <button class="btn action-btn repeat-btn" title="পুনরায় বুক করুন"><i class="fas fa-redo"></i></button>
                            </div>
                        </div>
                        
                        <div class="appointment-item cancelled" data-id="4">
                            <div class="client-info">
                                <img src="/ShebaXpert/Resources/images/man4.jpeg" alt="ক্লায়েন্ট">
                                <div>
                                    <h4>করিম উদ্দিন</h4>
                                    <p><i class="fas fa-map-marker-alt"></i> মোহাম্মদপুর, ঢাকা</p>
                                </div>
                            </div>
                            <div class="service-info">
                                <i class="fas fa-plug"></i>
                                <span>সকেট ইনস্টলেশন</span>
                            </div>
                            <div class="time-info">
                                <div class="date">৫ই জুন, ৩:০০ PM</div>
                                <div class="duration"><i class="fas fa-clock"></i> ২ ঘন্টা</div>
                            </div>
                            <div class="status-badge cancelled">
                                <i class="fas fa-times-circle"></i>
                                <span>বাতিল</span>
                            </div>
                            <div class="action-buttons">
                                <button class="btn action-btn reschedule-btn" title="পুনরায় বুক করুন"><i class="fas fa-calendar-alt"></i></button>
                                <button class="btn action-btn delete-btn" title="ডিলিট করুন"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="pagination">
                        <button class="btn pagination-btn disabled"><i class="fas fa-chevron-left"></i></button>
                        <button class="btn pagination-btn active">1</button>
                        <button class="btn pagination-btn">2</button>
                        <button class="btn pagination-btn">3</button>
                        <button class="btn pagination-btn"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
            </div>
            
            <!-- Appointment Detail Modal -->
            <div class="modal" id="appointment-detail-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>অ্যাপয়েন্টমেন্ট বিস্তারিত</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body" id="appointment-detail-content">
                        <!-- Content will be loaded dynamically -->
                    </div>
                </div>
            </div>
        `;

    // Appointment filter functionality
    document
      .getElementById("appointment-filter")
      .addEventListener("change", function () {
        const filterValue = this.value;
        const appointmentItems = document.querySelectorAll(".appointment-item");

        appointmentItems.forEach((item) => {
          if (filterValue === "all") {
            item.style.display = "flex";
          } else {
            if (item.classList.contains(filterValue)) {
              item.style.display = "flex";
            } else {
              item.style.display = "none";
            }
          }
        });
      });

    // New appointment button
    document
      .getElementById("new-appointment-btn")
      .addEventListener("click", function () {
        alert("নতুন অ্যাপয়েন্টমেন্ট ফর্ম খুলবে।");
      });

    // View appointment details
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const appointmentItem = this.closest(".appointment-item");
        const appointmentId = appointmentItem.getAttribute("data-id");
        showAppointmentDetails(appointmentId);
      });
    });

    // Function to show appointment details
   // Function to show appointment details
function showAppointmentDetails(appointmentId) {
    const modal = document.getElementById('appointment-detail-modal');
    modal.classList.add('active');

      // Sample data - in a real app this would come from a database
      const appointments = {
        1: {
          client: {
            name: "আব্দুল্লাহ আল মামুন",
            image: "/ShebaXpert/Resources/images/man3.jpg",
            phone: "০১৭১২৩৪৫৬৭৮",
            address: "মিরপুর ১০, রোড ৮, বাড়ি ১২, ঢাকা",
            email: "abdullah@example.com",
          },
          service: "ইলেকট্রিক্যাল মেরামত",
          date: "আগামীকাল, ১০:০০ AM",
          duration: "২ ঘন্টা",
          status: "নিশ্চিতকৃত",
          problem:
            "বাসার মেইন লাইন থেকে বিদ্যুৎ আসছে না। কিছুদিন ধরে সমস্যা ছিল, আজ একদম চলে গেছে।",
          notes:
            "ক্লায়েন্ট বলেছেন সকাল ১০টার পরে বাসায় থাকবেন। গেটের বেলটা কাজ করে না, তাই ফোন দিতে বলেছেন।",
        },
        2: {
          client: {
            name: "ফারহানা ইয়াসমিন",
            image: "/ShebaXpert/Resources/images/woman1.jpeg",
            phone: "০১৭৮৭৬৫৪৩২১",
            address: "উত্তরা সেক্টর ৭, রোড ১২, বাড়ি ৫, ঢাকা",
            email: "farhana@example.com",
          },
          service: "লাইট ফিক্সিং",
          date: "১৫ই জুন, ২:০০ PM",
          duration: "১ ঘন্টা",
          status: "পেন্ডিং",
          problem:
            "বাসার একটি রুমের লাইট কাজ করছে না। নতুন বাল্ব লাগিয়েও কাজ হয়নি।",
          notes:
            "ক্লায়েন্ট শুধু বিকালে সময় দিতে পারবেন। আগে ফোন করে নিশ্চিত হয়ে আসতে হবে।",
        },
        3: {
          client: {
            name: "রহিম উদ্দিন",
            image: "/ShebaXpert/Resources/images/man2.png",
            phone: "০১৯১২৩৪৫৬৭৮",
            address: "ধানমন্ডি ৩২, রোড ৫, বাড়ি ১০, ঢাকা",
            email: "rahim@example.com",
          },
          service: "ফ্যান ইনস্টলেশন",
          date: "১০ই জুন, ১১:০০ AM",
          duration: "১.৫ ঘন্টা",
          status: "সম্পন্ন",
          problem:
            "নতুন ফ্যান কিনেছেন, ইনস্টলেশন প্রয়োজন। পুরাতন ফ্যানটি খুলে ফেলতে হবে।",
          notes:
            "কাজ সম্পন্ন হয়েছে। ক্লায়েন্ট সন্তুষ্ট। পেমেন্ট নগদ নেওয়া হয়েছে।",
          review: {
            rating: 4.5,
            comment:
              "খুব ভালো সার্ভিস পেয়েছি। সময়মতো কাজ শেষ করেছেন এবং দামও যুক্তিসঙ্গত। পরবর্তীতেও আপনার সেবা নিবো ইনশাআল্লাহ।",
          },
        },
        4: {
          client: {
            name: "করিম উদ্দিন",
            image: "/ShebaXpert/Resources/images/man4.jpeg",
            phone: "০১৮১২৩৪৫৬৭৮",
            address: "মোহাম্মদপুর, রোড ১০, বাড়ি ২৫, ঢাকা",
            email: "karim@example.com",
          },
          service: "সকেট ইনস্টলেশন",
          date: "৫ই জুন, ৩:০০ PM",
          duration: "২ ঘন্টা",
          status: "বাতিল",
          problem: "নতুন সকেট লাগানো প্রয়োজন। ওয়াল মাউন্ট টাইপ চাচ্ছেন।",
          notes: "ক্লায়েন্ট নিজেই সমস্যা সমাধান করে ফেলেছেন বলে বাতিল করেছেন।",
          cancelReason: "আমি নিজেই সমস্যা সমাধান করে ফেলেছি।",
        },
      };

      const appointment = appointments[appointmentId];

      let reviewHTML = "";
      if (appointment.review) {
        reviewHTML = `
                    <div class="detail-section">
                        <h4>রিভিউ</h4>
                        <div class="review-detail">
                            <div class="rating">
                                ${Array(5)
                                  .fill()
                                  .map(
                                    (_, i) =>
                                      `<i class="fas fa-star${
                                        i <
                                        Math.floor(appointment.review.rating)
                                          ? ""
                                          : i < appointment.review.rating
                                          ? "-half-alt"
                                          : ""
                                      }"></i>`
                                  )
                                  .join("")}
                                <span>${appointment.review.rating}</span>
                            </div>
                            <p>${appointment.review.comment}</p>
                        </div>
                    </div>
                `;
      }

      let cancelHTML = "";
      if (appointment.cancelReason) {
        cancelHTML = `
                    <div class="detail-section">
                        <h4>বাতিলের কারণ</h4>
                        <p>${appointment.cancelReason}</p>
                    </div>
                `;
      }

      content.innerHTML = `
                <div class="client-detail">
                    <div class="client-image">
                        <img src="${appointment.client.image}" alt="${
        appointment.client.name
      }">
                    </div>
                    <div class="client-info">
                        <h4>${appointment.client.name}</h4>
                        <p><i class="fas fa-phone"></i> ${
                          appointment.client.phone
                        }</p>
                        <p><i class="fas fa-envelope"></i> ${
                          appointment.client.email
                        }</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${
                          appointment.client.address
                        }</p>
                    </div>
                </div>
                
                <div class="appointment-details">
                    <div class="detail-section">
                        <h4>সেবার বিবরণ</h4>
                        <p><strong>সেবা:</strong> ${appointment.service}</p>
                        <p><strong>তারিখ ও সময়:</strong> ${
                          appointment.date
                        }</p>
                        <p><strong>সময়কাল:</strong> ${appointment.duration}</p>
                        <p><strong>অবস্থা:</strong> ${appointment.status}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>সমস্যার বিবরণ</h4>
                        <p>${appointment.problem}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h4>নোটস</h4>
                        <p>${appointment.notes}</p>
                    </div>
                    
                    ${reviewHTML}
                    ${cancelHTML}
                </div>
                
                <div class="modal-actions">
                    <button class="btn secondary-btn close-modal-btn">বন্ধ করুন</button>
                    ${
                      appointment.status === "পেন্ডিং"
                        ? '<button class="btn primary-btn confirm-appointment-btn">নিশ্চিত করুন</button>'
                        : ""
                    }
                    ${
                      appointment.status === "নিশ্চিতকৃত"
                        ? '<button class="btn primary-btn complete-appointment-btn">সম্পন্ন করুন</button>'
                        : ""
                    }
                </div>
            `;




            
      // Show modal
      modal.style.display = "block";

      // Close modal handlers
      document.querySelector(".close-modal").addEventListener("click", () => {
        modal.style.display = "none";
      });

      document
        .querySelector(".close-modal-btn")
        .addEventListener("click", () => {
          modal.style.display = "none";
        });

      // Confirm appointment button
      if (document.querySelector(".confirm-appointment-btn")) {
        document
          .querySelector(".confirm-appointment-btn")
          .addEventListener("click", () => {
            const appointmentItem = document.querySelector(
              `.appointment-item[data-id="${appointmentId}"]`
            );
            appointmentItem.classList.remove("pending");
            appointmentItem.classList.add("confirmed");
            appointmentItem.querySelector(".status-badge").innerHTML =
              '<i class="fas fa-check-circle"></i><span>নিশ্চিতকৃত</span>';
            alert("অ্যাপয়েন্টমেন্ট নিশ্চিত করা হয়েছে।");
            modal.style.display = "none";
          });
      }

      // Complete appointment button
      if (document.querySelector(".complete-appointment-btn")) {
        document
          .querySelector(".complete-appointment-btn")
          .addEventListener("click", () => {
            const appointmentItem = document.querySelector(
              `.appointment-item[data-id="${appointmentId}"]`
            );
            appointmentItem.classList.remove("confirmed");
            appointmentItem.classList.add("completed");
            appointmentItem.querySelector(".status-badge").innerHTML =
              '<i class="fas fa-calendar-check"></i><span>সম্পন্ন</span>';
            alert("অ্যাপয়েন্টমেন্ট সম্পন্ন হিসেবে চিহ্নিত করা হয়েছে।");
            modal.style.display = "none";
          });
      }

      // Close modal when clicking outside
      window.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.style.display = "none";
        }
      });
    }

    // Function to close modal
function closeModal() {
    document.getElementById('appointment-detail-modal').classList.remove('active');
}

// Close when clicking X button
document.querySelector('.close-modal').addEventListener('click', closeModal);

// Close when clicking outside modal
document.getElementById('appointment-detail-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});
    // Other appointment action buttons
    document.querySelectorAll(".chat-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const clientName =
          this.closest(".appointment-item").querySelector(
            ".client-info h4"
          ).textContent;
        alert(`${clientName}-এর সাথে চ্যাট শুরু করা হচ্ছে।`);
        loadContent("message");
      });
    });

    document.querySelectorAll(".reschedule-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const clientName =
          this.closest(".appointment-item").querySelector(
            ".client-info h4"
          ).textContent;
        alert(`${clientName}-এর অ্যাপয়েন্টমেন্টের সময় পরিবর্তন ফর্ম খুলবে।`);
      });
    });

    document.querySelectorAll(".cancel-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const clientName =
          this.closest(".appointment-item").querySelector(
            ".client-info h4"
          ).textContent;
        if (
          confirm(
            `আপনি কি নিশ্চিতভাবে ${clientName}-এর অ্যাপয়েন্টমেন্ট বাতিল করতে চান?`
          )
        ) {
          const appointmentItem = this.closest(".appointment-item");
          appointmentItem.classList.remove("confirmed", "pending");
          appointmentItem.classList.add("cancelled");
          appointmentItem.querySelector(".status-badge").innerHTML =
            '<i class="fas fa-times-circle"></i><span>বাতিল</span>';
          alert("অ্যাপয়েন্টমেন্ট বাতিল করা হয়েছে।");
        }
      });
    });

    document.querySelectorAll(".confirm-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const appointmentItem = this.closest(".appointment-item");
        appointmentItem.classList.remove("pending");
        appointmentItem.classList.add("confirmed");
        appointmentItem.querySelector(".status-badge").innerHTML =
          '<i class="fas fa-check-circle"></i><span>নিশ্চিতকৃত</span>';
        alert("অ্যাপয়েন্টমেন্ট নিশ্চিত করা হয়েছে।");
      });
    });

    document.querySelectorAll(".review-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const appointmentId =
          this.closest(".appointment-item").getAttribute("data-id");
        showAppointmentDetails(appointmentId);
      });
    });

    document.querySelectorAll(".invoice-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const clientName =
          this.closest(".appointment-item").querySelector(
            ".client-info h4"
          ).textContent;
        alert(`${clientName}-এর জন্য ইনভয়েস তৈরি করা হচ্ছে।`);
      });
    });

    document.querySelectorAll(".repeat-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const clientName =
          this.closest(".appointment-item").querySelector(
            ".client-info h4"
          ).textContent;
        alert(
          `${clientName}-এর জন্য পুনরায় অ্যাপয়েন্টমেন্ট বুক করার ফর্ম খুলবে।`
        );
      });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const clientName =
          this.closest(".appointment-item").querySelector(
            ".client-info h4"
          ).textContent;
        if (
          confirm(
            `আপনি কি নিশ্চিতভাবে ${clientName}-এর অ্যাপয়েন্টমেন্ট ডিলিট করতে চান?`
          )
        ) {
          this.closest(".appointment-item").remove();
          alert("অ্যাপয়েন্টমেন্ট ডিলিট করা হয়েছে।");
        }
      });
    });

    // Pagination buttons
    document.querySelectorAll(".pagination-btn").forEach((btn) => {
      if (
        !btn.classList.contains("disabled") &&
        !btn.classList.contains("active")
      ) {
        btn.addEventListener("click", function () {
          document
            .querySelector(".pagination-btn.active")
            .classList.remove("active");
          this.classList.add("active");
          alert(`পৃষ্ঠা ${this.textContent} লোড করা হচ্ছে...`);
        });
      }
    });
  }

  // Messages content with all conversations
  function showMessages() {
    const dashboardContent = document.querySelector(".dashboard-content");
    dashboardContent.innerHTML = `
            <div class="messages-section">
                <div class="section-header">
                    <h2><i class="fas fa-comments"></i> মেসেজ</h2>
                    <div class="search-container">
                        <input type="text" id="message-search" placeholder="মেসেজ খুঁজুন...">
                        <i class="fas fa-search"></i>
                    </div>
                </div>
                
                <div class="messages-container">
                    <div class="conversation-list">
                        <div class="conversation-header">
                            <h3>কনভারসেশন</h3>
                            <button class="btn new-chat-btn" id="new-chat-btn"><i class="fas fa-plus"></i> নতুন চ্যাট</button>
                        </div>
                        
                        <div class="conversation-search">
                            <input type="text" id="contact-search" placeholder="কন্টাক্ট খুঁজুন...">
                            <i class="fas fa-search"></i>
                        </div>
                        
                        <div class="conversation-items" id="conversation-items">
                            <div class="conversation-item active" data-user="abdullah">
                                <div class="user-avatar">
                                    <img src="/ShebaXpert/Resources/images/man3.jpg" alt="ব্যবহারকারী">
                                    <span class="online-status"></span>
                                </div>
                                <div class="conversation-info">
                                    <div class="user-info">
                                        <h4>আব্দুল্লাহ আল মামুন</h4>
                                        <span class="time">১০:৩০ AM</span>
                                    </div>
                                    <p class="last-message">আপনি কি আগামীকাল আসবেন?</p>
                                    <span class="unread-count">২</span>
                                </div>
                            </div>
                            
                            <div class="conversation-item" data-user="farhana">
                                <div class="user-avatar">
                                    <img src="/ShebaXpert/Resources/images/woman1.jpeg" alt="ব্যবহারকারী">
                                    <span class="online-status"></span>
                                </div>
                                <div class="conversation-info">
                                    <div class="user-info">
                                        <h4>ফারহানা ইয়াসমিন</h4>
                                        <span class="time">গতকাল</span>
                                    </div>
                                    <p class="last-message">ধন্যবাদ আপনার সাহায্যের জন্য</p>
                                </div>
                            </div>
                            
                            <div class="conversation-item unread" data-user="rahim">
                                <div class="user-avatar">
                                    <img src="/ShebaXpert/Resources/images/man2.png" alt="ব্যবহারকারী">
                                    <span class="online-status online"></span>
                                </div>
                                <div class="conversation-info">
                                    <div class="user-info">
                                        <h4>রহিম উদ্দিন</h4>
                                        <span class="time">২ দিন আগে</span>
                                    </div>
                                    <p class="last-message">আমার ইলেকট্রিক্যাল সমস্যা আছে</p>
                                    <span class="unread-count">৫</span>
                                </div>
                            </div>
                            
                            <div class="conversation-item" data-user="karim">
                                <div class="user-avatar">
                                    <img src="/ShebaXpert/Resources/images/man4.jpeg" alt="ব্যবহারকারী">
                                    <span class="online-status"></span>
                                </div>
                                <div class="conversation-info">
                                    <div class="user-info">
                                        <h4>করিম উদ্দিন</h4>
                                        <span class="time">৩ দিন আগে</span>
                                    </div>
                                    <p class="last-message">আমি আপনার সেবা নিতে চাই</p>
                                </div>
                            </div>
                            
                            <div class="conversation-item" data-user="sumaiya">
                                <div class="user-avatar">
                                    <img src="/ShebaXpert/Resources/images/woman2.png" alt="ব্যবহারকারী">
                                    <span class="online-status online"></span>
                                </div>
                                <div class="conversation-info">
                                    <div class="user-info">
                                        <h4>সুমাইয়া আক্তার</h4>
                                        <span class="time">১ সপ্তাহ আগে</span>
                                    </div>
                                    <p class="last-message">আপনার ফোন নম্বরটি দিতে পারবেন?</p>
                                </div>
                            </div>
                            
                            <div class="conversation-item" data-user="jamil">
                                <div class="user-avatar">
                                    <img src="/ShebaXpert/Resources/images/man5.jpg" alt="ব্যবহারকারী">
                                    <span class="online-status"></span>
                                </div>
                                <div class="conversation-info">
                                    <div class="user-info">
                                        <h4>জামিল আহমেদ</h4>
                                        <span class="time">২ সপ্তাহ আগে</span>
                                    </div>
                                    <p class="last-message">আপনার সাথে দেখা করতে চাই</p>
                                </div>
                            </div>
                            
                            <div class="conversation-item" data-user="nazma">
                                <div class="user-avatar">
                                    <img src="/ShebaXpert/Resources/images/woman3.jpg" alt="ব্যবহারকারী">
                                    <span class="online-status"></span>
                                </div>
                                <div class="conversation-info">
                                    <div class="user-info">
                                        <h4>নাজমা আক্তার</h4>
                                        <span class="time">৩ সপ্তাহ আগে</span>
                                    </div>
                                    <p class="last-message">আপনার সার্ভিস সম্পর্কে জানতে চাই</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="message-view">
                        <div class="message-header">
                            <div class="recipient-info">
                                <div class="user-avatar">
                                    <img src="/ShebaXpert/Resources/images/man3.jpg" alt="ব্যবহারকারী">
                                    <span class="online-status"></span>
                                </div>
                                <div>
                                    <h4>আব্দুল্লাহ আল মামুন</h4>
                                    <p class="last-seen">সর্বশেষ দেখা: আজ ১০:১৫ AM</p>
                                </div>
                            </div>
                            <div class="message-actions">
                                <button class="btn action-btn call-btn" title="ফোন করুন"><i class="fas fa-phone"></i></button>
                                <button class="btn action-btn video-call-btn" title="ভিডিও কল"><i class="fas fa-video"></i></button>
                                <button class="btn action-btn appointment-btn" title="অ্যাপয়েন্টমেন্ট বুক করুন"><i class="fas fa-calendar-alt"></i></button>
                                <button class="btn action-btn more-btn" title="আরো"><i class="fas fa-ellipsis-v"></i></button>
                            </div>
                        </div>
                        
                        <div class="message-history" id="message-history">
                            <div class="date-divider">
                                <span>আজ</span>
                            </div>
                            
                            <div class="message received">
                                <div class="message-content">
                                    <p>আসসালামু আলাইকুম, আপনি কি আগামীকাল আসবেন?</p>
                                    <span class="time">১০:৩০ AM</span>
                                </div>
                            </div>
                            
                            <div class="message sent">
                                <div class="message-content">
                                    <p>ওয়ালাইকুম আসসালাম, হ্যাঁ আমি আসতে পারবো ইনশাআল্লাহ</p>
                                    <span class="time">১০:৩২ AM</span>
                                    <span class="status"><i class="fas fa-check-double"></i></span>
                                </div>
                            </div>
                            
                            <div class="message received">
                                <div class="message-content">
                                    <p>ভালো, কখন আসবেন?</p>
                                    <span class="time">১০:৩৩ AM</span>
                                </div>
                            </div>
                            
                            <div class="message sent">
                                <div class="message-content">
                                    <p>আমি সকাল ১০টায় আসবো। ঠিকানা এবং ফোন নম্বরটি আবার দিবেন?</p>
                                    <span class="time">১০:৩৫ AM</span>
                                    <span class="status"><i class="fas fa-check-double"></i></span>
                                </div>
                            </div>
                            
                            <div class="message received">
                                <div class="message-content">
                                    <p>মিরপুর ১০, রোড ৮, বাড়ি ১২। ফোন: ০১৭১২৩৪৫৬৭৮</p>
                                    <span class="time">১০:৩৬ AM</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="message-input-container">
                            <div class="input-actions">
                                <button class="btn action-btn attachment-btn" title="অ্যাটাচমেন্ট"><i class="fas fa-paperclip"></i></button>
                                <button class="btn action-btn emoji-btn" title="ইমোজি"><i class="far fa-smile"></i></button>
                            </div>
                            <input type="text" id="message-input" placeholder="এখানে মেসেজ লিখুন...">
                            <button class="btn send-btn" id="send-btn" title="পাঠান"><i class="fas fa-paper-plane"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `;

    // Conversation item click handler
    document.querySelectorAll(".conversation-item").forEach((item) => {
      item.addEventListener("click", function () {
        document
          .querySelector(".conversation-item.active")
          .classList.remove("active");
        this.classList.add("active");

        const userId = this.getAttribute("data-user");
        loadConversation(userId);
      });
    });

    // Load conversation function for all users
    function loadConversation(userId) {
      const messageHistory = document.getElementById("message-history");
      const recipientInfo = document.querySelector(".recipient-info h4");
      const recipientImage = document.querySelector(
        ".recipient-info .user-avatar img"
      );
      const lastSeen = document.querySelector(".recipient-info .last-seen");

      // Clear current messages
      messageHistory.innerHTML =
        '<div class="date-divider"><span>আজ</span></div>';

      // Conversation data for all users
      const conversations = {
        abdullah: {
          name: "আব্দুল্লাহ আল মামুন",
          image: "/ShebaXpert/Resources/images/man3.jpg",
          lastSeen: "সর্বশেষ দেখা: আজ ১০:১৫ AM",
          messages: [
            {
              type: "received",
              text: "আসসালামু আলাইকুম, আপনি কি আগামীকাল আসবেন?",
              time: "১০:৩০ AM",
            },
            {
              type: "sent",
              text: "ওয়ালাইকুম আসসালাম, হ্যাঁ আমি আসতে পারবো ইনশাআল্লাহ",
              time: "১০:৩২ AM",
            },
            { type: "received", text: "ভালো, কখন আসবেন?", time: "১০:৩৩ AM" },
            {
              type: "sent",
              text: "আমি সকাল ১০টায় আসবো। ঠিকানা এবং ফোন নম্বরটি আবার দিবেন?",
              time: "১০:৩৫ AM",
            },
            {
              type: "received",
              text: "মিরপুর ১০, রোড ৮, বাড়ি ১২। ফোন: ০১৭১২৩৪৫৬৭৮",
              time: "১০:৩৬ AM",
            },
          ],
        },
        farhana: {
          name: "ফারহানা ইয়াসমিন",
          image: "/ShebaXpert/Resources/images/woman1.jpeg",
          lastSeen: "সর্বশেষ দেখা: গতকাল ২:১৫ PM",
          messages: [
            {
              type: "received",
              text: "আপনার কাজের জন্য ধন্যবাদ।",
              time: "গতকাল ২:১৫ PM",
            },
            {
              type: "sent",
              text: "আপনাকেও ধন্যবাদ। কোনো সমস্যা হলে জানাবেন।",
              time: "গতকাল ২:২০ PM",
            },
            {
              type: "received",
              text: "ধন্যবাদ আপনার সাহায্যের জন্য",
              time: "গতকাল ২:২১ PM",
            },
          ],
        },
        rahim: {
          name: "রহিম উদ্দিন",
          image: "/ShebaXpert/Resources/images/man2.png",
          lastSeen: "অনলাইন",
          messages: [
            {
              type: "received",
              text: "আসসালামু আলাইকুম, আমার ইলেকট্রিক্যাল সমস্যা আছে",
              time: "২ দিন আগে",
            },
            {
              type: "sent",
              text: "ওয়ালাইকুম আসসালাম, বলুন কী সমস্যা?",
              time: "২ দিন আগে",
            },
            {
              type: "received",
              text: "বাসার মেইন সুইচ থেকে স্পার্ক হচ্ছে",
              time: "২ দিন আগে",
            },
            {
              type: "sent",
              text: "এটা খুবই বিপজ্জনক। আমি আজই আসতে পারি। ঠিকানা দিবেন?",
              time: "২ দিন আগে",
            },
            {
              type: "received",
              text: "ধানমন্ডি ৩২, রোড ৫, বাড়ি ১০",
              time: "২ দিন আগে",
            },
          ],
        },
        karim: {
          name: "করিম উদ্দিন",
          image: "/ShebaXpert/Resources/images/man4.jpeg",
          lastSeen: "সর্বশেষ দেখা: ৩ দিন আগে",
          messages: [
            {
              type: "received",
              text: "আসসালামু আলাইকুম, আমি আপনার সেবা নিতে চাই",
              time: "৩ দিন আগে",
            },
            {
              type: "sent",
              text: "ওয়ালাইকুম আসসালাম, বলুন কী ধরনের সেবা প্রয়োজন?",
              time: "৩ দিন আগে",
            },
            {
              type: "received",
              text: "আমার নতুন ফ্ল্যাটে ইলেকট্রিক্যাল ওয়ার্ক প্রয়োজন",
              time: "৩ দিন আগে",
            },
          ],
        },
        sumaiya: {
          name: "সুমাইয়া আক্তার",
          image: "/ShebaXpert/Resources/images/woman2.png",
          lastSeen: "অনলাইন",
          messages: [
            {
              type: "received",
              text: "আপনার ফোন নম্বরটি দিতে পারবেন?",
              time: "১ সপ্তাহ আগে",
            },
            {
              type: "sent",
              text: "হ্যাঁ, অবশ্যই। আমার নম্বর ০১৭১২৩৪৫৬৭৮",
              time: "১ সপ্তাহ আগে",
            },
          ],
        },
        jamil: {
          name: "জামিল আহমেদ",
          image: "/ShebaXpert/Resources/images/man5.jpg",
          lastSeen: "সর্বশেষ দেখা: ২ সপ্তাহ আগে",
          messages: [
            {
              type: "received",
              text: "আপনার সাথে দেখা করতে চাই",
              time: "২ সপ্তাহ আগে",
            },
            {
              type: "sent",
              text: "অবশ্যই, আপনি কখন আসতে পারবেন?",
              time: "২ সপ্তাহ আগে",
            },
          ],
        },
        nazma: {
          name: "নাজমা আক্তার",
          image: "/ShebaXpert/Resources/images/woman3.jpg",
          lastSeen: "সর্বশেষ দেখা: ৩ সপ্তাহ আগে",
          messages: [
            {
              type: "received",
              text: "আপনার সার্ভিস সম্পর্কে জানতে চাই",
              time: "৩ সপ্তাহ আগে",
            },
            {
              type: "sent",
              text: "আমি ইলেকট্রিক্যাল কাজ করি। আপনি কী ধরনের সেবা চান?",
              time: "৩ সপ্তাহ আগে",
            },
          ],
        },
      };

      const conversation = conversations[userId];

      // Update recipient info
      recipientInfo.textContent = conversation.name;
      recipientImage.src = conversation.image;
      recipientImage.alt = conversation.name;
      lastSeen.textContent = conversation.lastSeen;

      // Add messages to history
      conversation.messages.forEach((msg) => {
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${msg.type}`;
        messageDiv.innerHTML = `
                    <div class="message-content">
                        <p>${msg.text}</p>
                        <span class="time">${msg.time}</span>
                        ${
                          msg.type === "sent"
                            ? '<span class="status"><i class="fas fa-check-double"></i></span>'
                            : ""
                        }
                    </div>
                `;
        messageHistory.appendChild(messageDiv);
      });

      // Mark as read
      const conversationItem = document.querySelector(
        `.conversation-item[data-user="${userId}"]`
      );
      if (conversationItem) {
        const unreadCount = conversationItem.querySelector(".unread-count");
        if (unreadCount) unreadCount.remove();
        conversationItem.classList.remove("unread");
      }

      // Scroll to bottom
      messageHistory.scrollTop = messageHistory.scrollHeight;
    }

    // New chat button
    document
      .getElementById("new-chat-btn")
      .addEventListener("click", function () {
        alert("নতুন চ্যাট শুরু করার জন্য কন্টাক্ট লিস্ট দেখানো হবে।");
      });

    // Search functionality
    document
      .getElementById("contact-search")
      .addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase();
        const items = document.querySelectorAll(".conversation-item");

        items.forEach((item) => {
          const userName = item.querySelector("h4").textContent.toLowerCase();
          if (userName.includes(searchTerm)) {
            item.style.display = "flex";
          } else {
            item.style.display = "none";
          }
        });
      });

    // Message actions
    document.querySelector(".call-btn").addEventListener("click", function () {
      const recipient =
        document.querySelector(".recipient-info h4").textContent;
      alert(`${recipient}-কে কল করা হচ্ছে...`);
    });

    document
      .querySelector(".video-call-btn")
      .addEventListener("click", function () {
        const recipient =
          document.querySelector(".recipient-info h4").textContent;
        alert(`${recipient}-এর সাথে ভিডিও কল শুরু করা হচ্ছে...`);
      });

    document
      .querySelector(".appointment-btn")
      .addEventListener("click", function () {
        const recipient =
          document.querySelector(".recipient-info h4").textContent;
        alert(`${recipient}-এর সাথে অ্যাপয়েন্টমেন্ট বুক করার ফর্ম খুলবে।`);
      });

    document.querySelector(".more-btn").addEventListener("click", function () {
      alert("অতিরিক্ত অপশন দেখানো হচ্ছে...");
    });

    // Message sending functionality
    document.getElementById("send-btn").addEventListener("click", sendMessage);
    document
      .getElementById("message-input")
      .addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          sendMessage();
        }
      });

    function sendMessage() {
      const input = document.getElementById("message-input");
      const messageText = input.value.trim();

      if (messageText) {
        const messageHistory = document.getElementById("message-history");
        const now = new Date();
        const timeString = now.toLocaleTimeString("bn-BD", {
          hour: "2-digit",
          minute: "2-digit",
        });

        const messageDiv = document.createElement("div");
        messageDiv.className = "message sent";
        messageDiv.innerHTML = `
                    <div class="message-content">
                        <p>${messageText}</p>
                        <span class="time">${timeString}</span>
                        <span class="status"><i class="fas fa-check-double"></i></span>
                    </div>
                `;
        messageHistory.appendChild(messageDiv);
        input.value = "";

        // Scroll to bottom
        messageHistory.scrollTop = messageHistory.scrollHeight;

        // Update last message in conversation list
        const activeConvo = document.querySelector(".conversation-item.active");
        if (activeConvo) {
          activeConvo.querySelector(".last-message").textContent = messageText;
          activeConvo.querySelector(".time").textContent = timeString;
        }

        // Simulate reply after 1-3 seconds
        setTimeout(() => {
          const replies = [
            "ধন্যবাদ আপনার মেসেজের জন্য।",
            "আমি দেখছি, একটু পরে জানাবো।",
            "ঠিক আছে, ধন্যবাদ।",
            "আপনার মেসেজ পেয়েছি।",
          ];
          const randomReply =
            replies[Math.floor(Math.random() * replies.length)];

          const replyDiv = document.createElement("div");
          replyDiv.className = "message received";
          replyDiv.innerHTML = `
                        <div class="message-content">
                            <p>${randomReply}</p>
                            <span class="time">${new Date().toLocaleTimeString(
                              "bn-BD",
                              { hour: "2-digit", minute: "2-digit" }
                            )}</span>
                        </div>
                    `;
          messageHistory.appendChild(replyDiv);

          // Scroll to bottom
          messageHistory.scrollTop = messageHistory.scrollHeight;
        }, 1000 + Math.random() * 2000);
      }
    }

    // Attachment button
    document
      .querySelector(".attachment-btn")
      .addEventListener("click", function () {
        const input = document.createElement("input");
        input.type = "file";
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            alert(`${file.name} ফাইল অ্যাটাচ করা হয়েছে।`);
          }
        };
        input.click();
      });

    // Emoji button (simplified)
    document.querySelector(".emoji-btn").addEventListener("click", function () {
      alert("ইমোজি পিকার খুলবে।");
    });
  }

  // Settings content - Redesigned
  function showSettings() {
    const dashboardContent = document.querySelector(".dashboard-content");
    dashboardContent.innerHTML = `
            <div class="settings-section">
                <div class="settings-header">
                    <h2><i class="fas fa-cog"></i> সেটিংস</h2>
                    <p>আপনার অ্যাকাউন্ট এবং অ্যাপ্লিকেশন সেটিংস ম্যানেজ করুন</p>
                </div>
                
                <div class="settings-cards">
                    <div class="settings-card">
                        <div class="card-icon">
                            <i class="fas fa-user-cog"></i>
                        </div>
                        <h3>অ্যাকাউন্ট সেটিংস</h3>
                        <p>আপনার ব্যক্তিগত তথ্য এবং প্রোফাইল সেটিংস ম্যানেজ করুন</p>
                        <button class="btn secondary-btn" id="account-settings-btn">ম্যানেজ করুন</button>
                    </div>
                    
                    <div class="settings-card">
                        <div class="card-icon">
                            <i class="fas fa-bell"></i>
                        </div>
                        <h3>নোটিফিকেশন</h3>
                        <p>আপনি কোন নোটিফিকেশন পাবেন তা কাস্টমাইজ করুন</p>
                        <button class="btn secondary-btn" id="notification-settings-btn">ম্যানেজ করুন</button>
                    </div>
                    
                    <div class="settings-card">
                        <div class="card-icon">
                            <i class="fas fa-lock"></i>
                        </div>
                        <h3>প্রাইভেসি ও নিরাপত্তা</h3>
                        <p>আপনার প্রাইভেসি সেটিংস এবং অ্যাকাউন্ট সুরক্ষা</p>
                        <button class="btn secondary-btn" id="privacy-settings-btn">ম্যানেজ করুন</button>
                    </div>
                </div>
                
                <!-- Account Settings Modal -->
                <div class="modal" id="account-settings-modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>অ্যাকাউন্ট সেটিংস</h3>
                            <button class="close-modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <form class="settings-form" id="account-form">
                                <div class="form-group">
                                    <label for="name">নাম</label>
                                    <input type="text" id="name" value="${
                                      userData.name
                                    }">
                                </div>
                                
                                <div class="form-group">
                                    <label for="email">ইমেইল</label>
                                    <input type="email" id="email" value="${
                                      userData.email
                                    }">
                                </div>
                                
                                <div class="form-group">
                                    <label for="phone">ফোন নম্বর</label>
                                    <input type="tel" id="phone" value="${
                                      userData.phone
                                    }">
                                </div>
                                
                                <div class="form-group">
                                    <label for="profession">পেশা</label>
                                    <select id="profession">
                                        <option value="ইলেকট্রিশিয়ান" ${
                                          userData.profession ===
                                          "ইলেকট্রিশিয়ান"
                                            ? "selected"
                                            : ""
                                        }>ইলেকট্রিশিয়ান</option>
                                        <option value="প্লাম্বার" ${
                                          userData.profession === "প্লাম্বার"
                                            ? "selected"
                                            : ""
                                        }>প্লাম্বার</option>
                                        <option value="এসি টেকনিশিয়ান" ${
                                          userData.profession ===
                                          "এসি টেকনিশিয়ান"
                                            ? "selected"
                                            : ""
                                        }>এসি টেকনিশিয়ান</option>
                                        <option value="ক্লিনার" ${
                                          userData.profession === "ক্লিনার"
                                            ? "selected"
                                            : ""
                                        }>ক্লিনার</option>
                                    </select>
                                </div>
                                
                                <div class="form-actions">
                                    <button type="button" class="btn secondary-btn close-modal-btn">বাতিল করুন</button>
                                    <button type="submit" class="btn primary-btn">সেভ করুন</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                
                <!-- Notification Settings Modal -->
                <div class="modal" id="notification-settings-modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>নোটিফিকেশন সেটিংস</h3>
                            <button class="close-modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="notification-settings">
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>মেসেজ নোটিফিকেশন</h4>
                                        <p>যখন নতুন মেসেজ পাবেন তখন নোটিফিকেশন পাবেন</p>
                                    </div>
                                    <label class="switch">
                                        <input type="checkbox" id="message-notification" checked>
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>কল রিকুয়েস্ট নোটিফিকেশন</h4>
                                        <p>যখন কেউ কল রিকুয়েস্ট করবে তখন নোটিফিকেশন পাবেন</p>
                                    </div>
                                    <label class="switch">
                                        <input type="checkbox" id="call-notification" checked>
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>রিভিউ নোটিফিকেশন</h4>
                                        <p>যখন কেউ রিভিউ দিবে তখন নোটিফিকেশন পাবেন</p>
                                    </div>
                                    <label class="switch">
                                        <input type="checkbox" id="review-notification" checked>
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>অ্যাপয়েন্টমেন্ট রিমাইন্ডার</h4>
                                        <p>আপনার আসন্ন অ্যাপয়েন্টমেন্টের জন্য রিমাইন্ডার</p>
                                    </div>
                                    <label class="switch">
                                        <input type="checkbox" id="appointment-notification" checked>
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                
                                <div class="form-actions">
                                    <button type="button" class="btn secondary-btn close-modal-btn">বাতিল করুন</button>
                                    <button type="button" class="btn primary-btn save-notification-btn">সেভ করুন</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Privacy Settings Modal -->
                <div class="modal" id="privacy-settings-modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>প্রাইভেসি সেটিংস</h3>
                            <button class="close-modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="privacy-settings">
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>প্রোফাইল দৃশ্যমানতা</h4>
                                        <p>আপনার প্রোফাইল সবাই দেখতে পারবে কিনা</p>
                                    </div>
                                    <label class="switch">
                                        <input type="checkbox" id="profile-visibility" checked>
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>ফোন নম্বর দেখান</h4>
                                        <p>আপনার ফোন নম্বর কাস্টমাররা দেখতে পারবে কিনা</p>
                                    </div>
                                    <label class="switch">
                                        <input type="checkbox" id="phone-visibility">
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>ঠিকানা দেখান</h4>
                                        <p>আপনার ঠিকানা কাস্টমাররা দেখতে পারবে কিনা</p>
                                    </div>
                                    <label class="switch">
                                        <input type="checkbox" id="address-visibility">
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>অ্যাকাউন্ট সুরক্ষা</h4>
                                        <p>টু-ফ্যাক্টর অথেন্টিকেশন সক্রিয় করুন</p>
                                    </div>
                                    <label class="switch">
                                        <input type="checkbox" id="two-factor-auth">
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                                
                                <div class="password-change">
                                    <h4>পাসওয়ার্ড পরিবর্তন</h4>
                                    <div class="form-group">
                                        <label for="current-password">বর্তমান পাসওয়ার্ড</label>
                                        <input type="password" id="current-password">
                                    </div>
                                    <div class="form-group">
                                        <label for="new-password">নতুন পাসওয়ার্ড</label>
                                        <input type="password" id="new-password">
                                    </div>
                                    <div class="form-group">
                                        <label for="confirm-password">পাসওয়ার্ড নিশ্চিত করুন</label>
                                        <input type="password" id="confirm-password">
                                    </div>
                                </div>
                                
                                <div class="form-actions">
                                    <button type="button" class="btn secondary-btn close-modal-btn">বাতিল করুন</button>
                                    <button type="button" class="btn primary-btn save-privacy-btn">সেভ করুন</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    // Open account settings modal
    document
      .getElementById("account-settings-btn")
      .addEventListener("click", function () {
        document.getElementById("account-settings-modal").style.display =
          "block";
      });

    // Open notification settings modal
    document
      .getElementById("notification-settings-btn")
      .addEventListener("click", function () {
        document.getElementById("notification-settings-modal").style.display =
          "block";
      });

    // Open privacy settings modal
    document
      .getElementById("privacy-settings-btn")
      .addEventListener("click", function () {
        document.getElementById("privacy-settings-modal").style.display =
          "block";
      });

    // Close modal handlers
    document
      .querySelectorAll(".close-modal, .close-modal-btn")
      .forEach((btn) => {
        btn.addEventListener("click", function () {
          document.querySelectorAll(".modal").forEach((modal) => {
            modal.style.display = "none";
          });
        });
      });

    // Close modal when clicking outside
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", function (e) {
        if (e.target === this) {
          this.style.display = "none";
        }
      });
    });

    // Account form submission
    document
      .getElementById("account-form")
      .addEventListener("submit", function (e) {
        e.preventDefault();

        // Update user data
        userData.name = document.getElementById("name").value;
        userData.email = document.getElementById("email").value;
        userData.phone = document.getElementById("phone").value;
        userData.profession = document.getElementById("profession").value;

        // Update UI
        updateUserName();

        // Close modal
        document.getElementById("account-settings-modal").style.display =
          "none";
        alert("অ্যাকাউন্ট তথ্য সফলভাবে আপডেট করা হয়েছে।");
      });

    // Save notification settings
    document
      .querySelector(".save-notification-btn")
      .addEventListener("click", function () {
        alert("নোটিফিকেশন সেটিংস সফলভাবে সেভ করা হয়েছে।");
        document.getElementById("notification-settings-modal").style.display =
          "none";
      });

    // Save privacy settings
    document
      .querySelector(".save-privacy-btn")
      .addEventListener("click", function () {
        alert("প্রাইভেসি সেটিংস সফলভাবে সেভ করা হয়েছে।");
        document.getElementById("privacy-settings-modal").style.display =
          "none";
      });
  }

  // Logout handler
  function handleLogout() {
    if (confirm("আপনি কি নিশ্চিতভাবে লগ আউট করতে চান?")) {
      alert("আপনি সফলভাবে লগ আউট হয়েছেন।");
      // window.location.href = 'logout.php';
    }
  }

  // Initialize dashboard functionality
  function initDashboard() {
    // Notification dropdown
    const notification = document.querySelector(".notification");
    if (notification) {
      const notificationDropdown = document.createElement("div");
      notificationDropdown.className = "notification-dropdown";

      const notifications = [
        {
          icon: "comment",
          text: "নতুন মেসেজ পেয়েছেন",
          time: "৫ মিনিট আগে",
        },
        {
          icon: "phone",
          text: "মিসড কল: ০১৭১২৩৪৫৬৭৮",
          time: "১ ঘন্টা আগে",
        },
        {
          icon: "star",
          text: "আপনার প্রোফাইলটি ১০০ বার দেখা হয়েছে",
          time: "৩ ঘন্টা আগে",
        },
      ];

      notifications.forEach((notif) => {
        const item = document.createElement("div");
        item.className = "dropdown-item";
        item.innerHTML = `
                    <div class="dropdown-icon">
                        <i class="fas fa-${notif.icon}"></i>
                    </div>
                    <div class="dropdown-content">
                        <p>${notif.text}</p>
                        <span class="dropdown-time">${notif.time}</span>
                    </div>
                `;
        notificationDropdown.appendChild(item);
      });

      const seeAll = document.createElement("a");
      seeAll.className = "dropdown-see-all";
      seeAll.href = "#";
      seeAll.textContent = "সব নোটিফিকেশন দেখুন";
      notificationDropdown.appendChild(seeAll);

      notification.appendChild(notificationDropdown);

      notification.addEventListener("click", function (e) {
        e.stopPropagation();
        notificationDropdown.classList.toggle("show");
      });
    }

    // Close dropdowns when clicking outside
    document.addEventListener("click", function () {
      const dropdowns = document.querySelectorAll(
        ".notification-dropdown, .profile-dropdown"
      );
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove("show");
      });
    });

    // User profile dropdown
    const userProfile = document.querySelector(".user-profile");
    if (userProfile) {
      const profileDropdown = document.createElement("div");
      profileDropdown.className = "profile-dropdown";

      const profileItems = [
        {
          icon: "user",
          text: "প্রোফাইল",
          action: () => loadContent("profile"),
        },
        { icon: "cog", text: "সেটিংস", action: () => loadContent("settings") },
        { icon: "sign-out-alt", text: "লগ আউট", action: () => handleLogout() },
      ];

      profileItems.forEach((item) => {
        const link = document.createElement("a");
        link.href = "#";
        link.innerHTML = `<i class="fas fa-${item.icon}"></i> ${item.text}`;
        link.addEventListener("click", item.action);
        profileDropdown.appendChild(link);
      });

      userProfile.appendChild(profileDropdown);

      userProfile.addEventListener("click", function (e) {
        e.stopPropagation();
        profileDropdown.classList.toggle("show");
      });
    }

    // "See all" links
    document.querySelectorAll(".see-all").forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const section =
          this.closest(".section-header").querySelector("h3").textContent;
        alert(`${section} এর সব আইটেম দেখানো হবে।`);
      });
    });

    // Service area tags
    document.querySelectorAll(".area-tag").forEach((tag) => {
      tag.addEventListener("click", function () {
        const area = this.textContent;
        alert(`${area} এলাকার সার্ভিস রিকুয়েস্ট দেখানো হবে।`);
      });
    });

    // Simulate data updates
    setInterval(() => {
      const callCount = document.querySelector(".card:nth-child(1) p");
      const messageCount = document.querySelector(".card:nth-child(2) p");

      if (callCount && messageCount) {
        const newCallCount = Math.max(
          0,
          parseInt(callCount.textContent) + Math.floor(Math.random() * 3) - 1
        );
        const newMessageCount = Math.max(
          0,
          parseInt(messageCount.textContent) + Math.floor(Math.random() * 3) - 1
        );

        callCount.textContent = newCallCount;
        messageCount.textContent = newMessageCount;

        // Update notification badge
        const badge = document.querySelector(".badge");
        if (badge) {
          const totalNotifications = newCallCount + newMessageCount;
          badge.textContent =
            totalNotifications > 99 ? "99+" : totalNotifications;
        }
      }
    }, 5000);
  }

  // Initialize with dashboard view
  loadContent("dashboard");
});
