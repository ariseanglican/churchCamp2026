document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("survivorRegistrationForm")
    const dependentsContainer = document.getElementById("dependents-container")
    const addDependentBtn = document.getElementById("add-dependent")
    let dependentCount = 0
  
    // Add dependent functionality
    addDependentBtn.addEventListener("click", () => {
      dependentCount++
      const dependentDiv = document.createElement("div")
      dependentDiv.className = "dependent-item"
      dependentDiv.innerHTML = `
              <div class="dependent-header">
                  <span class="dependent-title">Dependent ${dependentCount}</span>
                  <button type="button" class="remove-dependent" onclick="removeDependent(this)">✕</button>
              </div>
              <div class="dependent-fields">
                  <div class="form-group">
                      <label for="dependent-name-${dependentCount}">Name *</label>
                      <input type="text" id="dependent-name-${dependentCount}" name="dependents[${dependentCount}][name]" required>
                  </div>
                  <div class="form-group">
                      <label>Age Group *</label>
                      <div class="radio-group">
                          <label class="radio-option">
                              <input type="radio" id="dependent-adult-${dependentCount}" name="dependents[${dependentCount}][ageGroup]" value="Adult">
                              <span class="radio-custom"></span>
                              <span class="radio-label">Adult</span>
                          </label>
                          
                          <label class="radio-option">
                              <input type="radio" id="dependent-university-${dependentCount}" name="dependents[${dependentCount}][ageGroup]" value="University/Concession">
                              <span class="radio-custom"></span>
                              <span class="radio-label">Uni/Concession</span>
                          </label>
                          
                          <label class="radio-option">
                              <input type="radio" id="dependent-youth-${dependentCount}" name="dependents[${dependentCount}][ageGroup]" value="High School">
                              <span class="radio-custom"></span>
                              <span class="radio-label">High School</span>
                          </label>
                          
                          <label class="radio-option">
                              <input type="radio" id="dependent-primary-school-${dependentCount}" name="dependents[${dependentCount}][ageGroup]" value="Primary School">
                              <span class="radio-custom"></span>
                              <span class="radio-label">Primary School</span>
                          </label>
                          
                          <label class="radio-option">
                              <input type="radio" id="dependent-preschool-${dependentCount}" name="dependents[${dependentCount}][ageGroup]" value="Preschool (2-5 yrs)">
                              <span class="radio-custom"></span>
                              <span class="radio-label">Preschool (2-5 yrs)</span>
                          </label>
                          
                          <label class="radio-option">
                              <input type="radio" id="dependent-infant-${dependentCount}" name="dependents[${dependentCount}][ageGroup]" value="Infant">
                              <span class="radio-custom"></span>
                              <span class="radio-label">Infant</span>
                          </label>
                      </div>
                  </div>
                  <div class="form-group">
                      <label>Gender *</label>
                      <div class="radio-group">
                          <label class="radio-option">
                              <input type="radio" id="dependent-male-${dependentCount}" name="dependents[${dependentCount}][gender]" value="male">
                              <span class="radio-custom"></span>
                              <span class="radio-label">Male</span>
                          </label>
                          
                          <label class="radio-option">
                              <input type="radio" id="dependent-female-${dependentCount}" name="dependents[${dependentCount}][gender]" value="female">
                              <span class="radio-custom"></span>
                              <span class="radio-label">Female</span>
                          </label>
                      </div>
                  </div>
              </div>
          `
      dependentsContainer.appendChild(dependentDiv)
    })
  
    // Remove dependent functionality
    window.removeDependent = (button) => {
      button.closest(".dependent-item").remove()
    }
  
    // Form submission
    const loadingOverlay = document.getElementById("loadingOverlay")
    const successOverlay = document.getElementById("successOverlay")
  
    form.addEventListener("submit", (event) => {
      event.preventDefault()
  
      loadingOverlay.classList.add("show")
  
      // Basic form validation
      const fullName = document.getElementById("fullName").value
      const email = document.getElementById("email").value
      const phone = document.getElementById("phone").value
      const gender = document.querySelector('input[name="gender"]:checked')
      const address = document.getElementById("address").value
      const emergencyContact = document.getElementById("emergencyContact").value
      const ageGroup = document.querySelector('input[name="ageGroup"]:checked')
      const transport = document.querySelector('input[name="transport"]:checked')
      // Validation checks
      if (!fullName || !email || !phone || !address || !emergencyContact) {
        alert("Please fill in all required personal information fields!")
        loadingOverlay.classList.remove("show")
        return
      }
  
      if (!gender) {
        alert("Please select your gender!")
        loadingOverlay.classList.remove("show")
        return
      }
  
      if (!ageGroup) {
        alert("Please select your age group!")
        loadingOverlay.classList.remove("show")
        return
      }
  
      if (!transport) {
        alert("Please select your transport arrangement!")
        loadingOverlay.classList.remove("show")
        return
      }

      // Validate dependents section
      const dependentItems = document.querySelectorAll(".dependent-item")
      if (dependentItems.length > 0) {
        for (let i = 0; i < dependentItems.length; i++) {
          const item = dependentItems[i]
          const nameInput = item.querySelector(`input[name*="[name]"]`)
          const ageGroupInput = item.querySelector(`input[name*="[ageGroup]"]:checked`)
          const genderInput = item.querySelector(`input[name*="[gender]"]:checked`)
          
          if (!nameInput || !nameInput.value.trim()) {
            alert(`Please fill in the name for Dependent ${i + 1}!`)
            loadingOverlay.classList.remove("show")
            return
          }

          if (!ageGroupInput) {
            alert(`Please select an age group for Dependent ${i + 1}!`)
            loadingOverlay.classList.remove("show")
            return
          }

          if (!genderInput) {
            alert(`Please select a gender for Dependent ${i + 1}!`)
            loadingOverlay.classList.remove("show")
            return
          }
        }
      }

      // Collect all form data
      const formData = new FormData(form)
      const data = {
        name: formData.get("fullName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        gender: formData.get("gender"),
        address: formData.get("address"),
        emergencyContact: formData.get("emergencyContact"),
        ageGroup: formData.get("ageGroup"),
        transport: formData.get("transport"),
        medicalInfo: formData.get("medicalInfo") || "",
        dependents: [],
      }
  
      // Collect dependents data (already validated above)
      dependentItems.forEach((item, index) => {
        const nameInput = item.querySelector(`input[name*="[name]"]`)
        const ageGroupInput = item.querySelector(`input[name*="[ageGroup]"]:checked`)
        const genderInput = item.querySelector(`input[name*="[gender]"]:checked`)
  
        if (nameInput && ageGroupInput && genderInput) {
          data.dependents.push({
            name: nameInput.value,
            ageGroup: ageGroupInput.value,
            gender: genderInput.value,
          })
        }
      })
  
      // Send POST request
      console.log(data)
      fetch("https://nvb8wg8dmh.execute-api.ap-southeast-2.amazonaws.com/test/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("Success:", result)
          loadingOverlay.classList.remove("show")
          successOverlay.classList.add("show")
          form.reset()
          // Clear dependents
          dependentsContainer.innerHTML = ""
          dependentCount = 0
        })
        .catch((error) => {
          console.error("Error:", error)
          loadingOverlay.classList.remove("show")
          alert("There was an error submitting your registration. Please try again.")
        })
    })
  })
