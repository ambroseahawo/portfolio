document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form")
  const submitButton = document.getElementById("submit-button")

  const firstNameInput = document.getElementById("first-name")
  const lastNameInput = document.getElementById("last-name")
  const companyInput = document.getElementById("company")
  const emailInput = document.getElementById("email")
  const countrySelect = document.getElementById("country")
  const phoneNumberInput = document.getElementById("phone-number")
  const messageTextarea = document.getElementById("message")
  const emailError = document.getElementById("email-error")
  const phoneError = document.getElementById("phone-error")

  let phoneFieldInteracted = false

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }

  const isValidPhoneNumber = (phone, countryCode) => {
    const cleaned = phone.trim().replace(/[\s\-\(\)]/g, "")

    if (cleaned.startsWith("+")) {
      const digitsOnly = cleaned.slice(1)
      return /^\d{7,15}$/.test(digitsOnly)
    }

    if (/^\d+$/.test(cleaned)) {
      return cleaned.length >= 7 && cleaned.length <= 15
    }

    if (countryCode && cleaned.length >= 7) {
      const fullNumber = countryCode.replace(/[^\d+]/g, "") + cleaned
      return /^\+?\d{7,15}$/.test(fullNumber.replace(/^\+/, ""))
    }

    return false
  }

  const checkFormValidity = () => {
    const firstName = firstNameInput?.value.trim() || ""
    const lastName = lastNameInput?.value.trim() || ""
    const company = companyInput?.value.trim() || ""
    const email = emailInput?.value.trim() || ""
    const country = countrySelect?.value.trim() || ""
    const phone = phoneNumberInput?.value.trim() || ""
    const message = messageTextarea?.value.trim() || ""

    const allFieldsFilled =
      firstName !== "" &&
      lastName !== "" &&
      company !== "" &&
      email !== "" &&
      country !== "" &&
      phone !== "" &&
      message !== ""

    const emailValid = isValidEmail(email)
    const phoneValid = isValidPhoneNumber(phone, country)

    const formIsValid = allFieldsFilled && emailValid && phoneValid

    if (submitButton) {
      submitButton.disabled = !formIsValid
    }

    if (emailInput && emailError) {
      if (email && !emailValid) {
        emailInput.setCustomValidity("Please enter a valid email address")
        emailError.textContent = "Please enter a valid email address"
        emailError.style.display = "block"
        emailInput.classList.add("!tw-border-red-500")
      } else {
        emailInput.setCustomValidity("")
        emailError.style.display = "none"
        emailInput.classList.remove("!tw-border-red-500")
      }
    }

    if (phoneNumberInput && phoneError) {
      if (phone && !phoneValid && phoneFieldInteracted) {
        phoneNumberInput.setCustomValidity(
          "Please enter a valid international phone number"
        )
        phoneError.textContent =
          "Please enter a valid international phone number"
        phoneError.style.display = "block"
        phoneNumberInput.classList.add("!tw-border-red-500")
      } else {
        phoneNumberInput.setCustomValidity("")
        phoneError.style.display = "none"
        phoneNumberInput.classList.remove("!tw-border-red-500")
      }
    }
  }

  const formFields = [
    firstNameInput,
    lastNameInput,
    companyInput,
    emailInput,
    countrySelect,
    phoneNumberInput,
    messageTextarea,
  ]

  formFields.forEach((field) => {
    if (field) {
      field.addEventListener("input", checkFormValidity)
      field.addEventListener("change", checkFormValidity)
      if (field === emailInput || field === phoneNumberInput) {
        field.addEventListener("blur", checkFormValidity)
      }
      if (field === phoneNumberInput) {
        field.addEventListener("input", () => {
          phoneFieldInteracted = true
        })
        field.addEventListener("focus", () => {
          phoneFieldInteracted = true
        })
      }
    }
  })

  fetch("https://ipapi.co/json/")
    .then((response) => response.json())
    .then((data) => {
      if (countrySelect && data.country_code) {
        if (
          !Array.from(countrySelect.options).some(
            (option) => option.value === data.country_code
          )
        ) {
          const option = document.createElement("option")
          option.value = data.country_code
          option.textContent = data.country_code
          countrySelect.appendChild(option)
        }
        countrySelect.value = data.country_code
      }

      if (phoneNumberInput && data.country_calling_code) {
        phoneNumberInput.value = data.country_calling_code
      }

      checkFormValidity()
    })
    .catch((error) => {
      console.error("Error fetching IP information:", error)
      checkFormValidity()
    })

  checkFormValidity()

  const successModal = document.getElementById("success-modal")
  const errorModal = document.getElementById("error-modal")
  const successModalContent = document.getElementById("success-modal-content")
  const errorModalContent = document.getElementById("error-modal-content")
  const closeSuccessModal = document.getElementById("close-success-modal")
  const closeErrorModal = document.getElementById("close-error-modal")

  const showSuccessModal = () => {
    if (successModal && successModalContent) {
      successModal.style.display = "flex"
      setTimeout(() => {
        successModal.classList.remove("!tw-opacity-0", "!tw-pointer-events-none")
        successModal.classList.add("!tw-opacity-100")
        successModalContent.classList.remove("!tw-translate-y-4")
        successModalContent.classList.add("!tw-translate-y-0")
      }, 10)
    }
  }

  const hideSuccessModal = () => {
    if (successModal && successModalContent) {
      successModal.classList.add("!tw-opacity-0", "!tw-pointer-events-none")
      successModal.classList.remove("!tw-opacity-100")
      successModalContent.classList.add("!tw-translate-y-4")
      successModalContent.classList.remove("!tw-translate-y-0")
      setTimeout(() => {
        successModal.style.display = "none"
      }, 300)
    }
  }

  const showErrorModal = () => {
    if (errorModal && errorModalContent) {
      errorModal.style.display = "flex"
      setTimeout(() => {
        errorModal.classList.remove("!tw-opacity-0", "!tw-pointer-events-none")
        errorModal.classList.add("!tw-opacity-100")
        errorModalContent.classList.remove("!tw-translate-y-4")
        errorModalContent.classList.add("!tw-translate-y-0")
      }, 10)
    }
  }

  const hideErrorModal = () => {
    if (errorModal && errorModalContent) {
      errorModal.classList.add("!tw-opacity-0", "!tw-pointer-events-none")
      errorModal.classList.remove("!tw-opacity-100")
      errorModalContent.classList.add("!tw-translate-y-4")
      errorModalContent.classList.remove("!tw-translate-y-0")
      setTimeout(() => {
        errorModal.style.display = "none"
      }, 300)
    }
  }

  if (closeSuccessModal) {
    closeSuccessModal.addEventListener("click", hideSuccessModal)
  }

  if (closeErrorModal) {
    closeErrorModal.addEventListener("click", hideErrorModal)
  }

  if (successModal) {
    successModal.addEventListener("click", (e) => {
      if (e.target === successModal) {
        hideSuccessModal()
      }
    })
  }

  if (errorModal) {
    errorModal.addEventListener("click", (e) => {
      if (e.target === errorModal) {
        hideErrorModal()
      }
    })
  }

  const urlParams = new URLSearchParams(window.location.search)
  const success = urlParams.get("success") === "true"
  const error = urlParams.get("error") === "true"

  if (success && contactForm) {
    showSuccessModal()
    setTimeout(() => {
      contactForm.reset()
      checkFormValidity()
      hideSuccessModal()
      window.history.replaceState({}, "", window.location.pathname)
    }, 3000)
  }

  if (error) {
    showErrorModal()
    setTimeout(() => {
      hideErrorModal()
      window.history.replaceState({}, "", window.location.pathname)
    }, 5000)
  }

  if (contactForm) {
    const originalButtonText = submitButton?.textContent || "Let's talk"
    
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault()
      
      checkFormValidity()
      
      if (submitButton?.disabled) {
        return false
      }

      if (submitButton) {
        submitButton.disabled = true
        submitButton.textContent = "Sending..."
      }

      const formData = new FormData(contactForm)
      
      try {
        const response = await fetch("/", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          contactForm.reset()
          checkFormValidity()
          if (submitButton) {
            submitButton.disabled = false
            submitButton.textContent = originalButtonText
          }
          showSuccessModal()
          setTimeout(() => {
            hideSuccessModal()
          }, 3000)
        } else {
          if (submitButton) {
            submitButton.disabled = false
            submitButton.textContent = originalButtonText
          }
          showErrorModal()
          setTimeout(() => {
            hideErrorModal()
          }, 5000)
        }
      } catch (error) {
        console.error("Form submission error:", error)
        if (submitButton) {
          submitButton.disabled = false
          submitButton.textContent = originalButtonText
        }
        showErrorModal()
        setTimeout(() => {
          hideErrorModal()
        }, 5000)
      }
    })

    formFields.forEach((field) => {
      if (field) {
        field.addEventListener("input", () => {
          if (submitButton && submitButton.textContent === "Sending...") {
            submitButton.textContent = originalButtonText
            checkFormValidity()
          }
        })
      }
    })
  }
})

