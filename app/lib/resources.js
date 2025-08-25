export const uiResources = {
  en: {
    // Backend namespaces (aligned with server)
    common: {
      success: 'Success',
      error: 'Error',
      statusSuccess: 'success',
      statusError: 'error',
      welcome: 'Welcome',
      loading: 'Loading...',
      notFound: 'Not found',
      unauthorized: 'Unauthorized access',
      forbidden: 'Access forbidden',
      internalError: 'Internal server error',
      badRequest: 'Bad request',
      created: 'Created successfully',
      updated: 'Updated successfully',
      deleted: 'Deleted successfully',
      operationFailed: 'Operation failed',
      invalidRequest: 'Invalid request',
      resourceNotFound: 'Resource not found',
      serverError: 'Server error occurred',
      maintenance: 'Server is under maintenance',
      rateLimited: 'Too many requests. Please try again later.',
      timeout: 'Request timeout',
      dataRetrieved: 'Data retrieved successfully',
      languageUpdated: 'Language updated successfully',
      languageReset: 'Language reset to default successfully'
    },
    ui: {
      brand: 'Cantina Mariachi',
      nav: {
        home: 'Home',
        menu: 'Menu',
        orders: 'Orders',
        reservations: 'Reservations',
        account: 'Account',
        profile: 'Profile',
        login: 'Login',
        register: 'Register',
        orderNow: 'Order Now'
      },
      footer: {
        tagline: 'Authentic Mexican flavors, modern experience.',
        quickLinks: 'Quick Links',
        contact: 'Contact',
        newsletter: 'Get 20% off your first order + exclusive deals 📧',
        emailPlaceholder: 'Email address',
        join: 'Join',
        privacy: 'Privacy',
        terms: 'Terms',
        copyright: '© {{year}} {{brand}}. All rights reserved.'
      }
    },
    events: {
      heading: 'Events & Catering',
      desc: 'We organize special events and catering for large groups. From birthdays to corporate events.',
      plan: 'Plan Event',
      catering: 'Catering Service',
      q1: {
        question: 'What is the minimum group size for events?',
        answer: 'Our minimum group size for events is 20 people. For smaller groups, we recommend regular reservations.'
      },
      q2: {
        question: 'Do you offer vegetarian and vegan options?',
        answer: 'Yes, we have a complete menu of vegetarian and vegan options. We can also customize menus according to your dietary needs.'
      }
    },
    navbar: {
      home: 'Home',
      menu: 'Menu',
      orders: 'Orders',
      reservations: 'Reservations',
      account: 'Account',
      profile: 'Profile',
      login: 'Login',
      register: 'Register',
      orderNow: 'Order Now',
      toggleLanguage: 'Toggle language',
      toggleTheme: 'Toggle theme',
      close: 'Close'
    },
    footer: {
      tagline: 'Authentic Mexican flavors, modern experience.',
      quickLinks: 'Quick Links',
      contact: 'Contact',
      newsletter: 'Get 20% off your first order + exclusive deals 📧',
      emailPlaceholder: 'Email address',
      join: 'Join',
      privacy: 'Privacy',
      terms: 'Terms',
      copyright: '© {{year}} {{brand}}. All rights reserved.'
    },
    faq: {
      heading: 'Frequently Asked Questions',
      q1: {
        question: 'What is your delivery time?',
        answer: 'Our average delivery time is 25-35 minutes. We use real-time tracking so you can see exactly when your order will arrive.'
      },
      q2: {
        question: 'Do you offer vegetarian and vegan options?',
        answer: 'Yes! We have a wide selection of vegetarian and vegan dishes. Our menu includes plant-based tacos, bowls, and sides.'
      },
      q3: {
        question: 'Can I customize my order?',
        answer: 'Absolutely! You can customize any dish by adding or removing ingredients. Just let us know your preferences when ordering.'
      }
    },
    popular: {
      heading: 'Popular This Week',
      seeMenu: 'See Full Menu',
      coming: 'Coming Soon',
      chefSpecial: 'Chef Special {{num}}',
      notify: 'Notify Me',
      rating: '4.9/5 from 2,400+ locals'
    },
    auth: {
      loginSuccess: 'Login successful',
      loginFailed: 'Login failed',
      logoutSuccess: 'Logout successful',
      registerSuccess: 'Registration successful',
      registerFailed: 'Registration failed',
      invalidCredentials: 'Invalid credentials',
      accountLocked: 'Account is locked',
      accountNotVerified: 'Account is not verified',
      passwordResetSent: 'Password reset link sent to your email',
      passwordResetSuccess: 'Password reset successful',
      passwordResetFailed: 'Password reset failed',
      tokenExpired: 'Token has expired',
      tokenInvalid: 'Invalid token',
      accessDenied: 'Access denied',
      sessionExpired: 'Session has expired',
      emailAlreadyExists: 'Email already exists',
      usernameAlreadyExists: 'Username already exists',
      accountCreated: 'Account created successfully',
      verificationEmailSent: 'Verification email sent',
      emailVerified: 'Email verified successfully',
      invalidVerificationToken: 'Invalid verification token'
    },
    api: {
      dataRetrieved: 'Data retrieved successfully',
      dataUpdated: 'Data updated successfully',
      dataCreated: 'Data created successfully',
      dataDeleted: 'Data deleted successfully',
      noDataFound: 'No data found',
      invalidApiKey: 'Invalid API key',
      apiKeyExpired: 'API key has expired',
      apiKeyRequired: 'API key is required',
      quotaExceeded: 'API quota exceeded',
      methodNotAllowed: 'Method not allowed',
      unsupportedMediaType: 'Unsupported media type',
      payloadTooLarge: 'Payload too large',
      requestEntityTooLarge: 'Request entity too large',
      contentTypeRequired: 'Content-Type header is required',
      jsonParseError: 'Invalid JSON format',
      missingRequiredField: 'Missing required field: {{field}}',
      invalidFieldValue: 'Invalid value for field: {{field}}',
      duplicateEntry: 'Duplicate entry found',
      constraintViolation: 'Database constraint violation',
      connectionError: 'Database connection error',
      checkApiDocsAction: 'Check the URL or refer to the API documentation for valid endpoints.'
    },
    validation: {
      required: '{{field}} is required',
      email: 'Please enter a valid email address',
      minLength: '{{field}} must be at least {{min}} characters long',
      maxLength: '{{field}} must not exceed {{max}} characters',
      passwordStrength: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number',
      passwordMatch: 'Passwords do not match',
      invalidFormat: 'Invalid format for {{field}}',
      invalidDate: 'Invalid date format',
      futureDateRequired: 'Date must be in the future',
      pastDateRequired: 'Date must be in the past',
      invalidPhone: 'Invalid phone number format',
      invalidUrl: 'Invalid URL format',
      numericOnly: '{{field}} must contain only numbers',
      alphabeticOnly: '{{field}} must contain only letters',
      alphanumericOnly: '{{field}} must contain only letters and numbers',
      invalidRange: '{{field}} must be between {{min}} and {{max}}',
      fileRequired: 'File is required',
      invalidFileType: 'Invalid file type. Allowed types: {{types}}',
      fileSizeExceeded: 'File size must not exceed {{maxSize}}',
      invalidImageFormat: 'Invalid image format',
      duplicateValue: '{{field}} already exists'
    },
    email: {
      subject: {
        welcome: 'Welcome to {{appName}}',
        passwordReset: 'Password Reset Request',
        emailVerification: 'Verify Your Email Address',
        accountLocked: 'Account Security Alert',
        loginAlert: 'New Login Detected'
      },
      greeting: 'Hello {{name}},',
      welcomeMessage: 'Welcome to {{appName}}! We are excited to have you with us.',
      passwordResetMessage: 'You have requested a password reset. Click the link below to proceed:',
      verificationMessage: 'Please verify your email address by clicking the link below:',
      accountLockedMessage: 'Your account has been temporarily locked due to multiple failed login attempts.',
      loginAlertMessage: 'We have detected a new login to your account from {{location}} at {{time}}.',
      footer: 'If you did not request this, please ignore this email or contact support.',
      buttonText: {
        resetPassword: 'Reset Password',
        verifyEmail: 'Verify Email',
        contactSupport: 'Contact Support'
      },
      expiryNotice: 'This link will expire in {{hours}} hours.',
      supportContact: 'If you need help, please contact us at {{email}}'
    },
    business: {
      menu: {
        itemCreated: 'Menu item created successfully',
        itemUpdated: 'Menu item updated successfully',
        itemDeleted: 'Menu item deleted successfully',
        itemNotFound: 'Menu item not found',
        categoryCreated: 'Menu category created successfully',
        categoryUpdated: 'Menu category updated successfully',
        categoryDeleted: 'Menu category deleted successfully',
        categoryNotFound: 'Menu category not found',
        itemOutOfStock: 'Menu item is out of stock',
        invalidPrice: 'Invalid price specified',
        duplicateItem: 'Menu item already exists'
      },
      orders: {
        orderCreated: 'Order created successfully',
        orderUpdated: 'Order updated successfully',
        orderCancelled: 'Order cancelled successfully',
        orderNotFound: 'Order not found',
        orderStatusUpdated: 'Order status updated successfully',
        invalidOrderStatus: 'Invalid order status',
        orderAlreadyCancelled: 'Order is already cancelled',
        orderCannotBeCancelled: 'Order cannot be cancelled at this stage',
        paymentRequired: 'Payment is required to complete the order',
        insufficientInventory: 'Insufficient inventory for some items',
        orderTotal: 'Order total: {{amount}}',
        estimatedDelivery: 'Estimated delivery time: {{time}} minutes'
      },
      reservations: {
        reservationCreated: 'Reservation created successfully',
        reservationUpdated: 'Reservation updated successfully',
        reservationCancelled: 'Reservation cancelled successfully',
        reservationNotFound: 'Reservation not found',
        reservationConfirmed: 'Reservation confirmed',
        tableNotAvailable: 'Table is not available at the requested time',
        invalidReservationTime: 'Invalid reservation time',
        reservationTooEarly: 'Reservation time is too far in the future',
        reservationTooLate: 'Reservation time has already passed',
        capacityExceeded: 'Group size exceeds table capacity'
      }
    },
    home: {
      hero: {
        badge: 'New: Rewards launch — earn points on every order',
        title: 'Authentic Mexican. <primary>Delivered fast.</primary>',
        desc: 'From street‑style tacos to slow‑cooked specialties. Order in seconds, reserve a table instantly, and track your delivery in real time — all in one place.',
        orderNow: 'Order Now',
        reserve: 'Reserve Table',
        browseMenu: 'Browse Menu',
        rating: '4.9/5 from 2,400+ locals',
        avgTime: '25-35 min avg',
        imageAlt: 'Colorful tacos platter with fresh ingredients and vibrant salsa',
        card: {
          title: "Fresh Daily",
          desc: 'We source ingredients from local markets every morning'
        }
      },
      explore: {
        heading: 'Explore Our Menu',
        tacos: 'Tacos',
        bowls: 'Bowls',
        drinks: 'Drinks',
        coming: 'Coming Soon',
        viewMore: 'View Full Menu',
        tabs: {
          tacos: 'Tacos',
          bowls: 'Bowls',
          drinks: 'Drinks'
        }
      },
      loyalty: {
        heading: 'Loyalty & Rewards',
        membersSave: 'Members save 10%',
        points: '1,250 points',
        nextAt: 'Next reward at {{points}}',
        freeDessert: 'Free dessert on your birthday',
        join: 'Join Now',
        perks: 'View Perks'
      },
      why: {
        heading: 'Why Choose Cantina Mariachi',
        faster: {
          title: 'Faster than delivery apps',
          desc: 'Direct from our kitchen to your door in 25-35 minutes'
        },
        fees: {
          title: 'No hidden fees',
          desc: 'Transparent pricing with no surprise charges'
        },
        oneTap: {
          title: 'One-tap reordering',
          desc: 'Reorder your favorites with just one tap'
        },
        tracking: {
          title: 'Live order tracking',
          desc: 'See exactly when your food will arrive'
        },
        chef: {
          title: 'Chef-crafted quality',
          desc: 'Every dish prepared by our expert chefs'
        },
        rewards: {
          title: 'Earn rewards',
          desc: 'Get points on every order and unlock exclusive perks'
        }
      },
      values: {
        heading: 'Our Values & Sourcing',
        desc: 'We\'re committed to quality, sustainability, and supporting local communities through responsible sourcing and eco-friendly practices.',
        badges: {
          localProduce: 'Local Produce',
          sustainableSeafood: 'Sustainable Seafood',
          fairTrade: 'Fair Trade',
          lowWaste: 'Low Waste'
        },
        cards: {
          dailyMarket: 'Daily Market Fresh',
          houseSalsas: 'House-Made Salsas',
          localTortillas: 'Local Tortillas',
          compostablePackaging: 'Compostable Packaging'
        }
      },
      value: {
        reorderDesc: 'Reorder your favorites in seconds',
        trustedTitle: 'Trusted by 10,000+ locals',
        trustedDesc: 'Join thousands of satisfied customers'
      },
      how: {
        heading: 'How It Works',
        desc: 'Ordering with Cantina Mariachi is simple and fast',
        step1: {
          title: 'Choose Your Favorites',
          desc: 'Browse our menu and select your favorite dishes'
        },
        step2: {
          title: 'Place Your Order',
          desc: 'Customize your order and checkout securely'
        },
        step3: {
          title: 'Track & Enjoy',
          desc: 'Follow your order in real-time and enjoy fresh food'
        }
      },
      testimonials: {
        heading: 'What Our Customers Say'
      },
      popular: {
        heading: 'Popular This Week',
        seeMenu: 'See Full Menu',
        coming: 'Coming Soon',
        chefSpecial: 'Chef Special {{num}}',
        notify: 'Notify Me',
        rating: '4.9/5 from 2,400+ locals'
      },
      faq: {
        heading: 'Frequently Asked Questions',
        q1: {
          question: 'What is your delivery time?',
          answer: 'Our average delivery time is 25-35 minutes. We use real-time tracking so you can see exactly when your order will arrive.'
        },
        q2: {
          question: 'Do you offer vegetarian and vegan options?',
          answer: 'Yes! We have a wide selection of vegetarian and vegan dishes. Our menu includes plant-based tacos, bowls, and sides.'
        },
        q3: {
          question: 'Can I customize my order?',
          answer: 'Absolutely! You can customize any dish by adding or removing ingredients. Just let us know your preferences when ordering.'
        }
      },
      cta: {
        endsTonight: '⚡ Ends Tonight',
        title: 'Limited Time: Taco Tuesday Bundle',
        desc: '2 tacos + drink for just $9.99. Perfect for sharing or keeping all to yourself.',
        socialProof: '🔥 2,400+ orders this week',
        limited: 'Limited Time Offer',
        start: 'Start Ordering',
        reserve: 'Reserve Table'
      },
      sticky: {
        order: 'Order Now',
        reserve: 'Reserve'
      },
      logo: {
        heading: 'Trusted by local businesses and food lovers'
      },
      offers: {
        heading: 'Seasonal Offers',
        badge: 'Limited time',
        bundle: 'Taco Tuesday Bundle',
        deal: '2 tacos + drink — $9.99',
        endsIn: 'Ends in',
        orderBundle: 'Order bundle',
        viewDetails: 'View details',
        coming: 'New offers are coming soon.',
        freeDelivery: 'Today only: free delivery on orders over $25'
      },
      events: {
        heading: 'Events & Catering',
        desc: 'We organize special events and catering for large groups. From birthdays to corporate events.',
        plan: 'Plan Event',
        catering: 'Catering Service',
        q1: {
          question: 'What is the minimum group size for events?',
          answer: 'Our minimum group size for events is 20 people. For smaller groups, we recommend regular reservations.'
        },
        q2: {
          question: 'Do you offer vegetarian and vegan options?',
          answer: 'Yes, we have a complete menu of vegetarian and vegan options. We can also customize menus according to your dietary needs.'
        }
      }
    }
  },
  
  // Spanish translations
  es: {
    common: {
      success: 'Éxito',
      error: 'Error',
      statusSuccess: 'éxito',
      statusError: 'error',
      welcome: 'Bienvenido',
      loading: 'Cargando...',
      notFound: 'No encontrado',
      unauthorized: 'Acceso no autorizado',
      forbidden: 'Acceso prohibido',
      internalError: 'Error interno del servidor',
      badRequest: 'Solicitud incorrecta',
      created: 'Creado exitosamente',
      updated: 'Actualizado exitosamente',
      deleted: 'Eliminado exitosamente',
      operationFailed: 'Operación fallida',
      invalidRequest: 'Solicitud inválida',
      resourceNotFound: 'Recurso no encontrado',
      serverError: 'Error del servidor',
      maintenance: 'El servidor está en mantenimiento',
      rateLimited: 'Demasiadas solicitudes. Inténtalo más tarde.',
      timeout: 'Tiempo de espera agotado',
      dataRetrieved: 'Datos recuperados exitosamente',
      languageUpdated: 'Idioma actualizado exitosamente',
      languageReset: 'Idioma restablecido al predeterminado exitosamente'
    },
    ui: {
      brand: 'Cantina Mariachi',
      nav: {
        home: 'Inicio',
        menu: 'Menú',
        orders: 'Pedidos',
        reservations: 'Reservas',
        account: 'Cuenta',
        profile: 'Perfil',
        login: 'Iniciar Sesión',
        register: 'Registrarse',
        orderNow: 'Ordenar Ahora'
      },
      footer: {
        tagline: 'Sabores mexicanos auténticos, experiencia moderna.',
        quickLinks: 'Enlaces Rápidos',
        contact: 'Contacto',
        newsletter: 'Obtén 20% de descuento en tu primer pedido + ofertas exclusivas 📧',
        emailPlaceholder: 'Dirección de correo electrónico',
        join: 'Unirse',
        privacy: 'Privacidad',
        terms: 'Términos',
        copyright: '© {{year}} {{brand}}. Todos los derechos reservados.'
      }
    },
    events: {
      heading: 'Eventos y Catering',
      desc: 'Organizamos eventos especiales y catering para grupos grandes. Desde cumpleaños hasta eventos corporativos.',
      plan: 'Planear Evento',
      catering: 'Servicio de Catering',
      q1: {
        question: '¿Cuál es el tamaño mínimo del grupo para eventos?',
        answer: 'Nuestro tamaño mínimo de grupo para eventos es de 20 personas. Para grupos más pequeños, recomendamos reservas regulares.'
      },
      q2: {
        question: '¿Ofrecen opciones vegetarianas y veganas?',
        answer: 'Sí, tenemos un menú completo de opciones vegetarianas y veganas. También podemos personalizar menús según tus necesidades dietéticas.'
      }
    },
    navbar: {
      home: 'Inicio',
      menu: 'Menú',
      orders: 'Pedidos',
      reservations: 'Reservas',
      account: 'Cuenta',
      profile: 'Perfil',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      orderNow: 'Ordenar Ahora',
      toggleLanguage: 'Cambiar idioma',
      toggleTheme: 'Cambiar tema',
      close: 'Cerrar'
    },
    footer: {
      tagline: 'Sabores mexicanos auténticos, experiencia moderna.',
      quickLinks: 'Enlaces Rápidos',
      contact: 'Contacto',
      newsletter: 'Obtén 20% de descuento en tu primer pedido + ofertas exclusivas 📧',
      emailPlaceholder: 'Dirección de correo electrónico',
      join: 'Unirse',
      privacy: 'Privacidad',
      terms: 'Términos',
      copyright: '© {{year}} {{brand}}. Todos los derechos reservados.'
      },
      q3: {
        question: '¿Puedo personalizar mi pedido?',
        answer: '¡Absolutamente! Puedes personalizar cualquier plato agregando o quitando ingredientes. Solo háznos saber tus preferencias al ordenar.'
      }
    },
    faq: {
      heading: 'Preguntas Frecuentes',
      q1: {
        question: '¿Cuál es su tiempo de entrega?',
        answer: 'Nuestro tiempo promedio de entrega es de 25-35 minutos. Usamos seguimiento en tiempo real para que puedas ver exactamente cuándo llegará tu pedido.'
      },
      q2: {
        question: '¿Ofrecen opciones vegetarianas y veganas?',
        answer: '¡Sí! Tenemos una amplia selección de platos vegetarianos y veganos. Nuestro menú incluye tacos, bowls y acompañamientos a base de plantas.'
      },
      q3: {
        question: '¿Puedo personalizar mi pedido?',
        answer: '¡Absolutamente! Puedes personalizar cualquier plato agregando o quitando ingredientes. Solo háznos saber tus preferencias al ordenar.'
      }
    },
    popular: {
      heading: 'Popular Esta Semana',
      seeMenu: 'Ver Menú Completo',
      coming: 'Próximamente',
      chefSpecial: 'Especial del Chef {{num}}',
      notify: 'Notifícame',
      rating: '4.9/5 de más de 2,400 locales'
    },
    auth: {
      loginSuccess: 'Connexion réussie',
      loginFailed: 'Échec de la connexion',
      logoutSuccess: 'Déconnexion réussie',
      registerSuccess: 'Inscription réussie',
      registerFailed: 'Échec de l\'inscription',
      invalidCredentials: 'Identifiants invalides',
      accountLocked: 'Le compte est verrouillé',
      accountNotVerified: 'Le compte n\'est pas vérifié',
      passwordResetSent: 'Lien de réinitialisation du mot de passe envoyé à votre email',
      passwordResetSuccess: 'Réinitialisation du mot de passe réussie',
      passwordResetFailed: 'Échec de la réinitialisation du mot de passe',
      tokenExpired: 'Le jeton a expiré',
      tokenInvalid: 'Jeton invalide',
      accessDenied: 'Accès refusé',
      sessionExpired: 'La session a expiré',
      emailAlreadyExists: 'L\'email existe déjà',
      usernameAlreadyExists: 'Le nom d\'utilisateur existe déjà',
      accountCreated: 'Compte créé avec succès',
      verificationEmailSent: 'Email de vérification envoyé',
      emailVerified: 'Email vérifié avec succès',
      invalidVerificationToken: 'Jeton de vérification invalide'
    },
    api: {
      dataRetrieved: 'Données récupérées avec succès',
      dataUpdated: 'Données mises à jour avec succès',
      dataCreated: 'Données créées avec succès',
      dataDeleted: 'Données supprimées avec succès',
      noDataFound: 'Aucune donnée trouvée',
      invalidApiKey: 'Clé API invalide',
      apiKeyExpired: 'La clé API a expiré',
      apiKeyRequired: 'Clé API requise',
      quotaExceeded: 'Quota API dépassé',
      methodNotAllowed: 'Méthode non autorisée',
      unsupportedMediaType: 'Type de média non pris en charge',
      payloadTooLarge: 'Charge utile trop volumineuse',
      requestEntityTooLarge: 'Entité de requête trop volumineuse',
      contentTypeRequired: 'En-tête Content-Type requis',
      jsonParseError: 'Format JSON invalide',
      missingRequiredField: 'Champ requis manquant: {{field}}',
      invalidFieldValue: 'Valeur invalide pour le champ: {{field}}',
      invalidFieldValue: 'Valeur invalide pour le champ: {{field}}',
      duplicateEntry: 'Entrée en double trouvée',
      constraintViolation: 'Violation de contrainte de base de données',
      connectionError: 'Erreur de connexion à la base de données',
      checkApiDocsAction: 'Vérifiez l\'URL ou consultez la documentation de l\'API pour des points de terminaison valides.'
    },
    validation: {
      required: '{{field}} est requis',
      email: 'Veuillez saisir une adresse email valide',
      minLength: '{{field}} doit contenir au moins {{min}} caractères',
      maxLength: '{{field}} ne doit pas dépasser {{max}} caractères',
      passwordStrength: 'Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une minuscule et un chiffre',
      passwordMatch: 'Les mots de passe ne correspondent pas',
      invalidFormat: 'Format invalide pour {{field}}',
      invalidDate: 'Format de date invalide',
      futureDateRequired: 'La date doit être dans le futur',
      pastDateRequired: 'La date doit être dans le passé',
      invalidPhone: 'Format de numéro de téléphone invalide',
      invalidUrl: 'Format d\'URL invalide',
      numericOnly: '{{field}} ne doit contenir que des chiffres',
      alphabeticOnly: '{{field}} ne doit contenir que des lettres',
      alphanumericOnly: '{{field}} ne doit contenir que des lettres et des chiffres',
      invalidRange: '{{field}} doit être entre {{min}} et {{max}}',
      fileRequired: 'Le fichier est requis',
      invalidFileType: 'Type de fichier invalide. Types autorisés: {{types}}',
      fileSizeExceeded: 'La taille du fichier ne doit pas dépasser {{maxSize}}',
      invalidImageFormat: 'Format d\'image invalide',
      duplicateValue: '{{field}} existe déjà'
    },
    email: {
      subject: {
        welcome: 'Bienvenue sur {{appName}}',
        passwordReset: 'Demande de réinitialisation de mot de passe',
        emailVerification: 'Vérifiez votre adresse email',
        accountLocked: 'Alerte de sécurité du compte',
        loginAlert: 'Nouvelle connexion détectée'
      },
      greeting: 'Bonjour {{name}},',
      welcomeMessage: 'Bienvenue sur {{appName}}! Nous sommes ravis de vous accueillir.',
      passwordResetMessage: 'Vous avez demandé une réinitialisation de mot de passe. Cliquez sur le lien ci-dessous pour continuer:',
      verificationMessage: 'Veuillez vérifier votre adresse email en cliquant sur le lien ci-dessous:',
      accountLockedMessage: 'Votre compte a été temporairement verrouillé en raison de plusieurs tentatives de connexion échouées.',
      loginAlertMessage: 'Nous avons détecté une nouvelle connexion à votre compte depuis {{location}} à {{time}}.',
      footer: 'Si vous n\'avez pas demandé cela, veuillez ignorer cet email ou contacter le support.',
      buttonText: {
        resetPassword: 'Réinitialiser le mot de passe',
        verifyEmail: 'Vérifier l\'email',
        contactSupport: 'Contacter le support'
      },
      expiryNotice: 'Ce lien expirera dans {{hours}} heures.',
      supportContact: 'Si vous avez besoin d\'aide, veuillez nous contacter à {{email}}'
    },
    business: {
      menu: {
        itemCreated: 'Élément du menu créé avec succès',
        itemUpdated: 'Élément du menu mis à jour avec succès',
        itemDeleted: 'Élément du menu supprimé avec succès',
        itemNotFound: 'Élément du menu non trouvé',
        categoryCreated: 'Catégorie du menu créée avec succès',
        categoryUpdated: 'Catégorie du menu mise à jour avec succès',
        categoryDeleted: 'Catégorie du menu supprimée avec succès',
        categoryNotFound: 'Catégorie du menu non trouvée',
        itemOutOfStock: 'Élément du menu en rupture de stock',
        invalidPrice: 'Prix invalide spécifié',
        duplicateItem: 'L\'élément du menu existe déjà'
      },
      orders: {
        orderCreated: 'Commande créée avec succès',
        orderUpdated: 'Commande mise à jour avec succès',
        orderCancelled: 'Commande annulée avec succès',
        orderNotFound: 'Commande non trouvée',
        orderStatusUpdated: 'Statut de la commande mis à jour avec succès',
        invalidOrderStatus: 'Statut de commande invalide',
        orderAlreadyCancelled: 'La commande est déjà annulée',
        orderCannotBeCancelled: 'La commande ne peut pas être annulée à ce stade',
        paymentRequired: 'Le paiement est requis pour finaliser la commande',
        insufficientInventory: 'Inventaire insuffisant pour certains articles',
        orderTotal: 'Total de la commande: {{amount}}',
        estimatedDelivery: 'Temps de livraison estimé: {{time}} minutes'
      },
      reservations: {
        reservationCreated: 'Réservation créée avec succès',
        reservationUpdated: 'Réservation mise à jour avec succès',
        reservationCancelled: 'Réservation annulée avec succès',
        reservationNotFound: 'Réservation non trouvée',
        reservationConfirmed: 'Réservation confirmée',
        tableNotAvailable: 'La table n\'est pas disponible à l\'heure demandée',
        invalidReservationTime: 'Heure de réservation invalide',
        reservationTooEarly: 'L\'heure de réservation est trop éloignée dans le futur',
        reservationTooLate: 'L\'heure de réservation est déjà passée',
        capacityExceeded: 'La taille du groupe dépasse la capacité de la table'
      }
    },
    home: {
      hero: {
        badge: 'Nuevo: Lanzamiento de recompensas — gana puntos en cada pedido',
        title: 'Mexicano auténtico. <primary>Entregado rápido.</primary>',
        desc: 'Desde tacos estilo callejero hasta especialidades cocinadas lentamente. Pide en segundos, reserva una mesa al instante y rastrea tu entrega en tiempo real — todo en un solo lugar.',
        orderNow: 'Ordenar Ahora',
        reserve: 'Reservar Mesa',
        browseMenu: 'Ver Menú',
        rating: '4.9/5 de 2,400+ locales',
        avgTime: '25-35 min promedio',
        imageAlt: 'Plato colorido de tacos con ingredientes frescos y salsa vibrante',
        card: {
          title: 'Fresco Diario',
          desc: 'Obtenemos ingredientes de mercados locales cada mañana'
        }
      },
      explore: {
        heading: 'Explora Nuestro Menú',
        tacos: 'Tacos',
        bowls: 'Bowls',
        drinks: 'Bebidas',
        coming: 'Próximamente',
        viewMore: 'Ver Menú Completo',
        tabs: {
          tacos: 'Tacos',
          bowls: 'Bowls',
          drinks: 'Bebidas'
        }
      },
      loyalty: {
        heading: 'Lealtad y Recompensas',
        membersSave: 'Los miembros ahorran 10%',
        points: '1,250 puntos',
        nextAt: 'Próxima recompensa en {{points}}',
        freeDessert: 'Postre gratis en tu cumpleaños',
        join: 'Únete Ahora',
        perks: 'Ver Beneficios'
      },
      why: {
        heading: 'Por qué Elegir Cantina Mariachi',
        faster: {
          title: 'Más rápido que las apps de entrega',
          desc: 'Directo de nuestra cocina a tu puerta en 25-35 minutos'
        },
        fees: {
          title: 'Sin cargos ocultos',
          desc: 'Precios transparentes sin cargos sorpresa'
        },
        oneTap: {
          title: 'Reordenar con un toque',
          desc: 'Reordena tus favoritos con solo un toque'
        },
        tracking: {
          title: 'Seguimiento en vivo',
          desc: 'Ve exactamente cuándo llegará tu comida'
        },
        chef: {
          title: 'Calidad de chef',
          desc: 'Cada plato preparado por nuestros chefs expertos'
        },
        rewards: {
          title: 'Gana recompensas',
          desc: 'Obtén puntos en cada pedido y desbloquea beneficios exclusivos'
        }
      },
      values: {
        heading: 'Nuestros Valores y Abastecimiento',
        desc: 'Estamos comprometidos con la calidad, la sostenibilidad y el apoyo a las comunidades locales a través del abastecimiento responsable y prácticas ecológicas.',
        badges: {
          localProduce: 'Productos Locales',
          sustainableSeafood: 'Mariscos Sostenibles',
          fairTrade: 'Comercio Justo',
          lowWaste: 'Bajo Desperdicio'
        },
        cards: {
          dailyMarket: 'Fresco del Mercado Diario',
          houseSalsas: 'Salsas Caseras',
          localTortillas: 'Tortillas Locales',
          compostablePackaging: 'Empaque Compostable'
        }
      },
      value: {
        reorderDesc: 'Reordena tus favoritos en segundos',
        trustedTitle: 'Confiado por más de 10,000 locales',
        trustedDesc: 'Únete a miles de clientes satisfechos'
      },
      how: {
        heading: 'Cómo Funciona',
        desc: 'Ordenar con Cantina Mariachi es simple y rápido',
        step1: {
          title: 'Elige Tus Favoritos',
          desc: 'Navega por nuestro menú y selecciona tus platos favoritos'
        },
        step2: {
          title: 'Haz Tu Pedido',
          desc: 'Personaliza tu pedido y paga de forma segura'
        },
        step3: {
          title: 'Rastrea y Disfruta',
          desc: 'Sigue tu pedido en tiempo real y disfruta comida fresca'
        }
      },
      testimonials: {
        heading: 'Lo Que Dicen Nuestros Clientes'
      },
      popular: {
        heading: 'Popular Esta Semana',
        seeMenu: 'Ver Menú Completo',
        coming: 'Próximamente',
        chefSpecial: 'Especial del Chef {{num}}',
        notify: 'Notifícame',
        rating: '4.9/5 de más de 2,400 locales'
      },
      faq: {
        heading: 'Preguntas Frecuentes',
        q1: {
          question: '¿Cuál es su tiempo de entrega?',
          answer: 'Nuestro tiempo promedio de entrega es de 25-35 minutos. Usamos seguimiento en tiempo real para que puedas ver exactamente cuándo llegará tu pedido.'
        },
        q2: {
          question: '¿Ofrecen opciones vegetarianas y veganas?',
          answer: '¡Sí! Tenemos una amplia selección de platos vegetarianos y veganos. Nuestro menú incluye tacos, bowls y acompañamientos a base de plantas.'
        },
        q3: {
          question: '¿Puedo personalizar mi pedido?',
          answer: '¡Absolutamente! Puedes personalizar cualquier plato agregando o quitando ingredientes. Solo háznos saber tus preferencias al ordenar.'
        }
      },
      cta: {
        endsTonight: '⚡ Termina Esta Noche',
        title: 'Tiempo Limitado: Combo Taco Tuesday',
        desc: '2 tacos + bebida por solo $9.99. Perfecto para compartir o quedártelo todo para ti.',
        socialProof: '🔥 Más de 2,400 pedidos esta semana',
        limited: 'Oferta por Tiempo Limitado',
        start: 'Comenzar a Ordenar',
        reserve: 'Reservar Mesa'
      },
      sticky: {
        order: 'Order Now',
        reserve: 'Reserve'
      },
      logo: {
        heading: 'Confiado por negocios locales y amantes de la comida'
      },
      offers: {
        heading: 'Ofertas de Temporada',
        badge: 'Tiempo Limitado',
        bundle: 'Paquete Taco Tuesday',
        deal: '2 tacos + bebida — $9.99',
        endsIn: 'Termina en',
        orderBundle: 'Ordenar Paquete',
        viewDetails: 'Ver Detalles',
        coming: 'Nuevas ofertas están llegando pronto.',
        freeDelivery: 'Solo hoy: envío gratuito en pedidos superiores a $25'
      },
      events: {
        heading: 'Eventos y Catering',
        desc: 'Organizamos eventos especiales y catering para grupos grandes. Desde cumpleaños hasta eventos corporativos.',
        plan: 'Planear Evento',
        catering: 'Servicio de Catering',
        q1: {
          question: '¿Cuál es el tamaño mínimo del grupo para eventos?',
          answer: 'Nuestro tamaño mínimo de grupo para eventos es de 20 personas. Para grupos más pequeños, recomendamos reservas regulares.'
        },
        q2: {
          question: '¿Ofrecen opciones vegetarianas y veganas?',
          answer: 'Sí, tenemos un menú completo de opciones vegetarianas y veganas. También podemos personalizar menús según tus necesidades dietéticas.'
      }
    }
  }
};