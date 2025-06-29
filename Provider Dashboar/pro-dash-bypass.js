document.addEventListener("DOMContentLoaded", function () {
  // Initialize user data from localStorage and backend
  let userData = {
    name: "টেস্ট ইউজার",
    email: "test@shebaxpert.com",
    phone: "০১৭১২৩৪৫৬৭৮",
    profession: "ইলেকট্রিশিয়ান",
    experience: "৫ বছর",
    areas: "ঢাকা, নারায়ণগঞ্জ, গাজীপুর",
    about:
      "আমি একজন দক্ষ ও প্রশিক্ষিত ইলেকট্রিশিয়ান। ৫ বছরের বেশি অভিজ্ঞতা রয়েছে ঘরোয়া ও বাণিজ্যিক ইলেকট্রিক্যাল কাজে। সৎ ও বিশ্বস্তভাবে কাজ করাই আমার নীতি।",
    profileImage: "/ShebaXpert/Resources/images/user.jpg",
  };

  // Skip authentication for testing - comment out the loadUserData() call
  // loadUserData();
  
  // Directly initialize the dashboard
  updateUserName();
  updateUserProfile();

  async function loadUserData() {
    // This function is disabled for testing
    console.log('Authentication bypassed for testing');
  }

  function updateUserProfile() {
    // Update profile image in header
    const headerProfileImg = document.querySelector('.user-profile img');
    if (headerProfileImg) {
      headerProfileImg.src = userData.profileImage;
    }
    
    // Update user name in header
    const headerUserName = document.querySelector('.user-profile span');
    if (headerUserName) {
      headerUserName.textContent = userData.name;
    }
    
    // Update all other user name elements
    updateUserName();
  }

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
        alert('লগ আউট ফিচার টেস্ট মোডে নিষ্ক্রিয়');
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

  // Include all other functions from the original file...
  // Full dashboard functionality included below
  
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

  function showAppointments() {
    const dashboardContent = document.querySelector(".dashboard-content");
    dashboardContent.innerHTML = `
      <div style="padding: 20px;">
        <h2>অ্যাপয়েন্টমেন্ট (টেস্ট মোড)</h2>
        <p>টেস্ট মোডে। সম্পূর্ণ অ্যাপয়েন্টমেন্ট ফিচার দেখতে মূল ড্যাশবোর্ড ব্যবহার করুন।</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4>টেস্ট অ্যাপয়েন্টমেন্ট:</h4>
          <div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 5px;">
            <strong>ক্লায়েন্ট:</strong> আব্দুল্লাহ আল মামুন<br>
            <strong>সেবা:</strong> ইলেকট্রিক্যাল মেরামত<br>
            <strong>তারিখ:</strong> আগামীকাল, ১০:০০ AM<br>
            <strong>অবস্থা:</strong> <span style="color: green;">নিশ্চিতকৃত</span>
          </div>
        </div>
      </div>
    `;
  }

  function showMessages() {
    const dashboardContent = document.querySelector(".dashboard-content");
    dashboardContent.innerHTML = `
      <div style="padding: 20px;">
        <h2>মেসেজ (টেস্ট মোড)</h2>
        <p>টেস্ট মোডে। সম্পূর্ণ মেসেজিং ফিচার দেখতে মূল ড্যাশবোর্ড ব্যবহার করুন।</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4>টেস্ট মেসেজ:</h4>
          <div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 5px;">
            <strong>রহিম উদ্দিন:</strong><br>
            "আপনি কি আগামীকাল আসবেন?"<br>
            <small style="color: #666;">১০ মিনিট আগে</small>
          </div>
        </div>
      </div>
    `;
  }

  function showSettings() {
    const dashboardContent = document.querySelector(".dashboard-content");
    dashboardContent.innerHTML = `
      <div style="padding: 20px;">
        <h2>সেটিংস (টেস্ট মোড)</h2>
        <p>টেস্ট মোডে। সম্পূর্ণ সেটিংস ফিচার দেখতে মূল ড্যাশবোর্ড ব্যবহার করুন।</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4>উপলব্ধ সেটিংস:</h4>
          <ul>
            <li>অ্যাকাউন্ট সেটিংস</li>
            <li>নোটিফিকেশন সেটিংস</li>
            <li>প্রাইভেসি সেটিংস</li>
            <li>পাসওয়ার্ড পরিবর্তন</li>
          </ul>
        </div>
      </div>
    `;
  }

  // Add basic dashboard initialization
  function initDashboard() {
    // "See all" links
    document.querySelectorAll(".see-all").forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const section = this.closest(".section-header").querySelector("h3").textContent;
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
  }

  // Initialize with dashboard view
  loadContent("dashboard");
});
