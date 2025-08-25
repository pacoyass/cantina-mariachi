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
      topbar: {
        open: 'Open',
        closed: 'Closed',
        eta: '{{mins}} min',
        noSignup: 'No signup required',
        browse: 'Browse Menu'
      },
      a11y: {
        toggleLanguage: 'Toggle language'
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
      topbar: {
        open: 'Abrir',
        closed: 'Cerrado',
        eta: '{{mins}} min',
        noSignup: 'No se requiere registro',
        browse: 'Ver Menú'
      },
      a11y: {
        toggleLanguage: 'Cambiar idioma'
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
      loginSuccess: 'Inicio de sesión exitoso',
      loginFailed: 'Falló el inicio de sesión',
      logoutSuccess: 'Cierre de sesión exitoso',
      registerSuccess: 'Registro exitoso',
      registerFailed: 'Falló el registro',
      invalidCredentials: 'Credenciales inválidas',
      accountLocked: 'La cuenta está bloqueada',
      accountNotVerified: 'La cuenta no está verificada',
      passwordResetSent: 'Enlace de restablecimiento de contraseña enviado a tu email',
      passwordResetSuccess: 'Restablecimiento de contraseña exitoso',
      passwordResetFailed: 'Falló el restablecimiento de contraseña',
      tokenExpired: 'El token ha expirado',
      tokenInvalid: 'Token inválido',
      accessDenied: 'Acceso denegado',
      sessionExpired: 'La sesión ha expirado',
      emailAlreadyExists: 'El email ya existe',
      usernameAlreadyExists: 'El nombre de usuario ya existe',
      accountCreated: 'Cuenta creada exitosamente',
      verificationEmailSent: 'Email de verificación enviado',
      emailVerified: 'Email verificado exitosamente',
      invalidVerificationToken: 'Token de verificación inválido'
    },
    api: {
      dataRetrieved: 'Datos recuperados exitosamente',
      dataUpdated: 'Datos actualizados exitosamente',
      dataCreated: 'Datos creados exitosamente',
      dataDeleted: 'Datos eliminados exitosamente',
      noDataFound: 'No se encontraron datos',
      invalidApiKey: 'Clave API inválida',
      apiKeyExpired: 'La clave API ha expirado',
      apiKeyRequired: 'Clave API requerida',
      quotaExceeded: 'Cuota API excedida',
      methodNotAllowed: 'Método no permitido',
      unsupportedMediaType: 'Tipo de medio no soportado',
      payloadTooLarge: 'Carga útil demasiado grande',
      requestEntityTooLarge: 'Entidad de solicitud demasiado grande',
      contentTypeRequired: 'Encabezado Content-Type requerido',
      jsonParseError: 'Formato JSON inválido',
      missingRequiredField: 'Campo requerido faltante: {{field}}',
      invalidFieldValue: 'Valor inválido para el campo: {{field}}',
      duplicateEntry: 'Entrada duplicada encontrada',
      constraintViolation: 'Violación de restricción de base de datos',
      connectionError: 'Error de conexión a la base de datos',
      checkApiDocsAction: 'Verifica la URL o consulta la documentación de la API para endpoints válidos.'
    },
    validation: {
      required: '{{field}} es requerido',
      email: 'Por favor ingresa una dirección de email válida',
      minLength: '{{field}} debe tener al menos {{min}} caracteres',
      maxLength: '{{field}} no debe exceder {{max}} caracteres',
      passwordStrength: 'La contraseña debe contener al menos 8 caracteres, una letra mayúscula, una minúscula y un número',
      passwordMatch: 'Las contraseñas no coinciden',
      invalidFormat: 'Formato inválido para {{field}}',
      invalidDate: 'Formato de fecha inválido',
      futureDateRequired: 'La fecha debe estar en el futuro',
      pastDateRequired: 'La fecha debe estar en el pasado',
      invalidPhone: 'Formato de número de teléfono inválido',
      invalidUrl: 'Formato de URL inválido',
      numericOnly: '{{field}} debe contener solo números',
      alphabeticOnly: '{{field}} debe contener solo letras',
      alphanumericOnly: '{{field}} debe contener solo letras y números',
      invalidRange: '{{field}} debe estar entre {{min}} y {{max}}',
      fileRequired: 'El archivo es requerido',
      invalidFileType: 'Tipo de archivo inválido. Tipos permitidos: {{types}}',
      fileSizeExceeded: 'El tamaño del archivo no debe exceder {{maxSize}}',
      invalidImageFormat: 'Formato de imagen inválido',
      duplicateValue: '{{field}} ya existe'
    },
    email: {
      subject: {
        welcome: 'Bienvenido a {{appName}}',
        passwordReset: 'Solicitud de Restablecimiento de Contraseña',
        emailVerification: 'Verifica tu Dirección de Email',
        accountLocked: 'Alerta de Seguridad de Cuenta',
        loginAlert: 'Nueva Conexión Detectada'
      },
      greeting: 'Hola {{name}},',
      welcomeMessage: '¡Bienvenido a {{appName}}! Estamos emocionados de tenerte con nosotros.',
      passwordResetMessage: 'Has solicitado un restablecimiento de contraseña. Haz clic en el enlace de abajo para continuar:',
      verificationMessage: 'Por favor verifica tu dirección de email haciendo clic en el enlace de abajo:',
      accountLockedMessage: 'Tu cuenta ha sido temporalmente bloqueada debido a múltiples intentos fallidos de inicio de sesión.',
      loginAlertMessage: 'Hemos detectado una nueva conexión a tu cuenta desde {{location}} a las {{time}}.',
      footer: 'Si no solicitaste esto, por favor ignora este email o contacta soporte.',
      buttonText: {
        resetPassword: 'Restablecer Contraseña',
        verifyEmail: 'Verificar Email',
        contactSupport: 'Contactar Soporte'
      },
      expiryNotice: 'Este enlace expirará en {{hours}} horas.',
      supportContact: 'Si necesitas ayuda, por favor contáctanos en {{email}}'
    },
    business: {
      menu: {
        itemCreated: 'Elemento del menú creado exitosamente',
        itemUpdated: 'Elemento del menú actualizado exitosamente',
        itemDeleted: 'Elemento del menú eliminado exitosamente',
        itemNotFound: 'Elemento del menú no encontrado',
        categoryCreated: 'Categoría del menú creada exitosamente',
        categoryUpdated: 'Categoría del menú actualizada exitosamente',
        categoryDeleted: 'Categoría del menú eliminada exitosamente',
        categoryNotFound: 'Categoría del menú no encontrada',
        itemOutOfStock: 'Elemento del menú agotado',
        invalidPrice: 'Precio inválido especificado',
        duplicateItem: 'L\'elemento del menú ya existe'
      },
      orders: {
        orderCreated: 'Pedido creado exitosamente',
        orderUpdated: 'Pedido actualizado exitosamente',
        orderCancelled: 'Pedido cancelado exitosamente',
        orderNotFound: 'Pedido no encontrado',
        orderStatusUpdated: 'Estado del pedido actualizado exitosamente',
        invalidOrderStatus: 'Estado de pedido inválido',
        orderAlreadyCancelled: 'El pedido ya está cancelado',
        orderCannotBeCancelled: 'El pedido no puede ser cancelado en esta etapa',
        paymentRequired: 'El pago es requerido para completar el pedido',
        insufficientInventory: 'Inventario insuficiente para algunos items',
        orderTotal: 'Total del pedido: {{amount}}',
        estimatedDelivery: 'Tiempo de entrega estimado: {{time}} minutos'
      },
      reservations: {
        reservationCreated: 'Reserva creada exitosamente',
        reservationUpdated: 'Reserva actualizada exitosamente',
        reservationCancelled: 'Reserva cancelada exitosamente',
        reservationNotFound: 'Reserva no encontrada',
        reservationConfirmed: 'Reserva confirmada',
        tableNotAvailable: 'La mesa no está disponible a la hora solicitada',
        invalidReservationTime: 'Hora de reserva inválida',
        reservationTooEarly: 'La hora de reserva está muy lejos en el futuro',
        reservationTooLate: 'La hora de reserva ya pasó',
        capacityExceeded: 'El tamaño del grupo excede la capacidad de la mesa'
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
          localTortillas: 'Local Tortillas',
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
  
  // French translations
  fr: {
    common: {
      success: 'Succès',
      error: 'Erreur',
      statusSuccess: 'succès',
      statusError: 'erreur',
      welcome: 'Bienvenue',
      loading: 'Chargement...',
      notFound: 'Non trouvé',
      unauthorized: 'Accès non autorisé',
      forbidden: 'Accès interdit',
      internalError: 'Erreur interne du serveur',
      badRequest: 'Requête incorrecte',
      created: 'Créé avec succès',
      updated: 'Mis à jour avec succès',
      deleted: 'Supprimé avec succès',
      operationFailed: 'Opération échouée',
      invalidRequest: 'Requête invalide',
      resourceNotFound: 'Ressource non trouvée',
      serverError: 'Erreur du serveur',
      maintenance: 'Le serveur est en maintenance',
      rateLimited: 'Trop de requêtes. Veuillez réessayer plus tard.',
      timeout: 'Délai d\'attente dépassé',
      dataRetrieved: 'Données récupérées avec succès',
      languageUpdated: 'Langue mise à jour avec succès',
      languageReset: 'Langue remise à la valeur par défaut avec succès'
    },
    ui: {
      brand: 'Cantina Mariachi',
      nav: {
        home: 'Accueil',
        menu: 'Menu',
        orders: 'Commandes',
        reservations: 'Réservations',
        account: 'Compte',
        profile: 'Profil',
        login: 'Connexion',
        register: 'S\'inscrire',
        orderNow: 'Commander Maintenant'
      },
      topbar: {
        open: 'Ouvert',
        closed: 'Fermé',
        eta: '{{mins}} min',
        noSignup: 'Aucune inscription requise',
        browse: 'Parcourir le Menu'
      },
      a11y: {
        toggleLanguage: 'Changer de langue'
      },
      footer: {
        tagline: 'Saveurs mexicaines authentiques, expérience moderne.',
        quickLinks: 'Liens Rapides',
        contact: 'Contact',
        newsletter: 'Obtenez 20% de réduction sur votre première commande + offres exclusives 📧',
        emailPlaceholder: 'Adresse e-mail',
        join: 'Rejoindre',
        privacy: 'Confidentialité',
        terms: 'Conditions',
        copyright: '© {{year}} {{brand}}. Tous droits réservés.'
      }
    },
    events: {
      heading: 'Événements et Traiteur',
      desc: 'Nous organisons des événements spéciaux et des services de traiteur pour de grands groupes. Des anniversaires aux événements d\'entreprise.',
      plan: 'Planifier l\'Événement',
      catering: 'Service de Traiteur',
      q1: {
        question: 'Quelle est la taille minimale du groupe pour les événements?',
        answer: 'Notre taille minimale de groupe pour les événements est de 20 personnes. Pour les groupes plus petits, nous recommandons des réservations régulières.'
      },
      q2: {
        question: 'Offrez-vous des options végétariennes et véganes?',
        answer: 'Oui, nous avons un menu complet d\'options végétariennes et véganes. Nous pouvons également personnaliser les menus selon vos besoins alimentaires.'
      }
    },
    navbar: {
      home: 'Accueil',
      menu: 'Menu',
      orders: 'Commandes',
      reservations: 'Réservations',
      account: 'Compte',
      profile: 'Profil',
      login: 'Connexion',
      register: 'S\'inscrire',
      orderNow: 'Commander Maintenant',
      toggleLanguage: 'Changer de langue',
      toggleTheme: 'Changer de thème',
      close: 'Fermer'
    },
    footer: {
      tagline: 'Saveurs mexicaines authentiques, expérience moderne.',
      quickLinks: 'Liens Rapides',
      contact: 'Contact',
      newsletter: 'Obtenez 20% de réduction sur votre première commande + offres exclusives 📧',
      emailPlaceholder: 'Adresse e-mail',
      join: 'Rejoindre',
      privacy: 'Confidentialité',
      terms: 'Conditions',
      copyright: '© {{year}} {{brand}}. Tous droits réservés.'
    },
    faq: {
      heading: 'Questions Fréquemment Posées',
      q1: {
        question: 'Quel est votre temps de livraison?',
        answer: 'Notre temps de livraison moyen est de 25-35 minutes. Nous utilisons un suivi en temps réel pour que vous puissiez voir exactement quand votre commande arrivera.'
      },
      q2: {
        question: 'Offrez-vous des options végétariennes et véganes?',
        answer: 'Oui! Nous avons une large sélection de plats végétariens et véganes. Notre menu comprend des tacos, des bols et des accompagnements à base de plantes.'
      },
      q3: {
        question: 'Puis-je personnaliser ma commande?',
        answer: 'Absolument! Vous pouvez personnaliser n\'importe quel plat en ajoutant ou en supprimant des ingrédients. Faites-nous simplement savoir vos préférences lors de la commande.'
      }
    },
    popular: {
      heading: 'Populaire Cette Semaine',
      seeMenu: 'Voir le Menu Complet',
      coming: 'Bientôt Disponible',
      chefSpecial: 'Spécial du Chef {{num}}',
      notify: 'Me Notifier',
      rating: '4.9/5 de plus de 2,400 locaux'
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
      passwordResetSent: 'Lien de réinitialisation du mot de passe envoyé à votre e-mail',
      passwordResetSuccess: 'Réinitialisation du mot de passe réussie',
      passwordResetFailed: 'Échec de la réinitialisation du mot de passe',
      tokenExpired: 'Le jeton a expiré',
      tokenInvalid: 'Jeton invalide',
      accessDenied: 'Accès refusé',
      sessionExpired: 'La session a expiré',
      emailAlreadyExists: 'L\'e-mail existe déjà',
      usernameAlreadyExists: 'Le nom d\'utilisateur existe déjà',
      accountCreated: 'Compte créé avec succès',
      verificationEmailSent: 'E-mail de vérification envoyé',
      emailVerified: 'E-mail vérifié avec succès',
      invalidVerificationToken: 'Jeton de vérification invalide'
    },
    api: {
      dataRetrieved: 'Données récupérées avec succès',
      dataUpdated: 'Données mises à jour avec succès',
      dataCreated: 'Données créées avec succès',
      dataDeleted: 'Données supprimées avec succès',
      noDataFound: 'Aucune donnée trouvée',
      invalidApiKey: 'Clé API inválida',
      apiKeyExpired: 'La clé API a expiré',
      apiKeyRequired: 'Clé API requise',
      quotaExceeded: 'Cuota API excedida',
      methodNotAllowed: 'Méthode no permitido',
      unsupportedMediaType: 'Type de média non pris en charge',
      payloadTooLarge: 'Charge utile trop volumineuse',
      requestEntityTooLarge: 'Entité de requête trop volumineuse',
      contentTypeRequired: 'En-tête Content-Type requis',
      jsonParseError: 'Format JSON invalide',
      missingRequiredField: 'Champ requis manquant: {{field}}',
      invalidFieldValue: 'Valeur invalide pour le champ: {{field}}',
      duplicateEntry: 'Entrée en double trouvée',
      constraintViolation: 'Violation de contrainte de base de données',
      connectionError: 'Erreur de connexion à la base de données',
      checkApiDocsAction: 'Vérifiez l\'URL ou consultez la documentation de l\'API pour des points de terminaison valides.'
    },
    validation: {
      required: '{{field}} est requis',
      email: 'Veuillez saisir une adresse e-mail valide',
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
        emailVerification: 'Vérifiez votre adresse e-mail',
        accountLocked: 'Alerte de sécurité du compte',
        loginAlert: 'Nouvelle connexion détectée'
      },
      greeting: 'Bonjour {{name}},',
      welcomeMessage: 'Bienvenue sur {{appName}}! Nous sommes ravis de vous accueillir.',
      passwordResetMessage: 'Vous avez demandé une réinitialisation de mot de passe. Cliquez sur le lien ci-dessous pour continuer:',
      verificationMessage: 'Veuillez vérifier votre adresse e-mail en cliquant sur le lien ci-dessous:',
      accountLockedMessage: 'Votre compte a été temporairement verrouillé en raison de plusieurs tentatives de connexion échouées.',
      loginAlertMessage: 'Nous avons détecté une nouvelle connexion à votre compte depuis {{location}} à {{time}}.',
      footer: 'Si vous n\'avez pas demandé cela, veuillez ignorer cet e-mail ou contacter le support.',
      buttonText: {
        resetPassword: 'Réinitialiser le mot de passe',
        verifyEmail: 'Vérifier l\'e-mail',
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
        badge: 'Nouveau: Lancement des récompenses — gagnez des points sur chaque commande',
        title: 'Authentisch mexikanisch. <primary>Schnell geliefert.</primary>',
        desc: 'Von Straßentacos bis zu langsam gekochten Spezialitäten. Bestellen Sie in Sekunden, reservieren Sie sofort einen Tisch und verfolgen Sie Ihre Lieferung in Echtzeit — alles an einem Ort.',
        orderNow: 'Jetzt Bestellen',
        reserve: 'Tisch Reservieren',
        browseMenu: 'Menü Durchsuchen',
        rating: '4.9/5 von über 2,400 Einheimischen',
        avgTime: '25-35 Min Durchschnitt',
        imageAlt: 'Bunte Tacos-Platte mit frischen Zutaten und lebendiger Salsa',
        card: {
          title: 'Täglich Frisch',
          desc: 'Wir beziehen Zutaten jeden Morgen von lokalen Märkten'
        }
      },
      explore: {
        heading: 'Entdecken Sie Unser Menü',
        tacos: 'Tacos',
        bowls: 'Bowls',
        drinks: 'Getränke',
        coming: 'Demnächst Verfügbar',
        viewMore: 'Vollständiges Menü Anzeigen',
        tabs: {
          tacos: 'Tacos',
          bowls: 'Bowls',
          drinks: 'Getränke'
        }
      },
      loyalty: {
        heading: 'Treue & Belohnungen',
        membersSave: 'Mitglieder sparen 10%',
        points: '1,250 Punkte',
        nextAt: 'Nächste Belohnung bei {{points}}',
        freeDessert: 'Kostenloses Dessert zu Ihrem Geburtstag',
        join: 'Jetzt Beitreten',
        perks: 'Vorteile Anzeigen'
      },
      why: {
        heading: 'Warum Cantina Mariachi Wählen',
        faster: {
          title: 'Schneller als Liefer-Apps',
          desc: 'Direkt von unserer Küche zu Ihrer Tür in 25-35 Minuten'
        },
        fees: {
          title: 'Keine versteckten Gebühren',
          desc: 'Transparente Preise ohne Überraschungsgebühren'
        },
        oneTap: {
          title: 'Ein-Tap-Nachbestellung',
          desc: 'Bestellen Sie Ihre Favoriten mit nur einem Tap nach'
        },
        tracking: {
          title: 'Live-Bestellverfolgung',
          desc: 'Sehen Sie genau, wann Ihr Essen ankommt'
        },
        chef: {
          title: 'Chef-gefertigte Qualität',
          desc: 'Jedes Gericht wird von unseren Experten-Chefs zubereitet'
        },
        rewards: {
          title: 'Verdienen Sie Belohnungen',
          desc: 'Erhalten Sie Punkte bei jeder Bestellung und schalten Sie exklusive Vorteile frei'
        }
      },
      values: {
        heading: 'Unsere Werte & Beschaffung',
        desc: 'Wir setzen uns für Qualität, Nachhaltigkeit und die Unterstützung lokaler Gemeinschaften durch verantwortungsvolle Beschaffung und umweltfreundliche Praktiken ein.',
        badges: {
          localProduce: 'Lokale Produkte',
          sustainableSeafood: 'Nachhaltige Meeresfrüchte',
          fairTrade: 'Fairen Handel',
          lowWaste: 'Weniger Abfall'
        },
        cards: {
          dailyMarket: 'Täglich Frisch vom Markt',
          houseSalsas: 'Hausgemachte Salsas',
          localTortillas: 'Lokale Tortillas',
          compostablePackaging: 'Kompostierbare Verpackung'
        }
      },
      value: {
        reorderDesc: 'Bestellen Sie Ihre Favoriten in Sekunden nach',
        trustedTitle: 'Vertraut von über 10,000 Einheimischen',
        trustedDesc: 'Schließen Sie sich Tausenden zufriedener Kunden an'
      },
      how: {
        heading: 'Wie Es Funktioniert',
        desc: 'Bestellen bei Cantina Mariachi ist einfach und schnell',
        step1: {
          title: 'Wählen Sie Ihre Favoriten',
          desc: 'Durchsuchen Sie unser Menü und wählen Sie Ihre Lieblingsgerichte'
        },
        step2: {
          title: 'Passez Votre Commande',
          desc: 'Personnalisez votre commande et payez en toute sécurité'
        },
        step3: {
          title: 'Suivez et Savourez',
          desc: 'Suivez votre commande en temps réel et savourez une nourriture fraîche'
        }
      },
      testimonials: {
        heading: 'Was Unsere Kunden Sagen'
      },
      popular: {
        heading: 'Diese Woche Beliebt',
        seeMenu: 'Vollständiges Menü Anzeigen',
        coming: 'Demnächst Verfügbar',
        chefSpecial: 'Chef-Spezial {{num}}',
        notify: 'Benachrichtigen Sie Mich',
        rating: '4.9/5 von über 2,400 Einheimischen'
      },
      faq: {
        heading: 'Häufig Gestellte Fragen',
        q1: {
          question: 'Wie lange dauert die Lieferung?',
          answer: 'Unsere durchschnittliche Lieferzeit beträgt 25-35 Minuten. Wir verwenden Echtzeit-Tracking, damit Sie genau sehen können, wann Ihre Bestellung ankommt.'
        },
        q2: {
          question: 'Bieten Sie vegetarische und vegane Optionen an?',
          answer: 'Ja! Wir haben eine große Auswahl an vegetarischen und veganen Gerichten. Unser Menü umfasst pflanzliche Tacos, Bowls und Beilagen.'
        },
        q3: {
          question: 'Kann ich meine Bestellung anpassen?',
          answer: 'Absolut! Sie können jedes Gericht anpassen, indem Sie Zutaten hinzufügen oder entfernen. Teilen Sie uns einfach Ihre Vorlieben bei der Bestellung mit.'
        }
      },
      cta: {
        endsTonight: '⚡ Endet Heute Nacht',
        title: 'Zeitlich Begrenzt: Taco Tuesday Bundle',
        desc: '2 Tacos + Getränk für nur 9,99€. Perfekt zum Teilen oder alles für sich zu behalten.',
        socialProof: '🔥 2,400+ orders this week',
        limited: 'Limited Time Offer',
        start: 'Start Ordering',
        reserve: 'Reserve Table'
      },
      sticky: {
        order: 'Order Now',
        reserve: 'Reservieren'
      },
      logo: {
        heading: 'Trusted by local businesses and food lovers'
      },
      offers: {
        heading: 'Saisonale Angebote',
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
  
  // German translations
  de: {
    common: {
      success: 'Erfolg',
      error: 'Fehler',
      statusSuccess: 'erfolg',
      statusError: 'fehler',
      welcome: 'Willkommen',
      loading: 'Lädt...',
      notFound: 'Nicht gefunden',
      unauthorized: 'Nicht autorisierter Zugriff',
      forbidden: 'Zugriff verboten',
      internalError: 'Interner Serverfehler',
      badRequest: 'Ungültige Anfrage',
      created: 'Erfolgreich erstellt',
      updated: 'Erfolgreich aktualisiert',
      deleted: 'Erfolgreich gelöscht',
      operationFailed: 'Operation fehlgeschlagen',
      invalidRequest: 'Ungültige Anfrage',
      resourceNotFound: 'Ressource nicht gefunden',
      serverError: 'Serverfehler aufgetreten',
      maintenance: 'Server ist in Wartung',
      rateLimited: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.',
      timeout: 'Anfrage-Timeout',
      dataRetrieved: 'Daten erfolgreich abgerufen',
      languageUpdated: 'Sprache erfolgreich aktualisiert',
      languageReset: 'Sprache erfolgreich auf Standard zurückgesetzt'
    },
    ui: {
      brand: 'Cantina Mariachi',
      nav: {
        home: 'Startseite',
        menu: 'Menü',
        orders: 'Bestellungen',
        reservations: 'Reservierungen',
        account: 'Konto',
        profile: 'Profil',
        login: 'Anmelden',
        register: 'Registrieren',
        orderNow: 'Jetzt Bestellen'
      },
      topbar: {
        open: 'Geöffnet',
        closed: 'Geschlossen',
        eta: '{{mins}} Min',
        noSignup: 'Keine Anmeldung erforderlich',
        browse: 'Menü Durchsuchen'
      },
      a11y: {
        toggleLanguage: 'Sprache wechseln'
      },
      footer: {
        tagline: 'Authentische mexikanische Aromen, moderne Erfahrung.',
        quickLinks: 'Schnelllinks',
        contact: 'Kontakt',
        newsletter: 'Erhalten Sie 20% Rabatt auf Ihre erste Bestellung + exklusive Angebote 📧',
        emailPlaceholder: 'E-Mail-Adresse',
        join: 'Beitreten',
        privacy: 'Datenschutz',
        terms: 'AGB',
        copyright: '© {{year}} {{brand}}. Alle Rechte vorbehalten.'
      }
    },
    events: {
      heading: 'Veranstaltungen & Catering',
      desc: 'Wir organisieren besondere Veranstaltungen und Catering für große Gruppen. Von Geburtstagen bis zu Firmenveranstaltungen.',
      plan: 'Veranstaltung Planen',
      catering: 'Catering-Service',
      q1: {
        question: 'Was ist die Mindestgruppengröße für Veranstaltungen?',
        answer: 'Unsere Mindestgruppengröße für Veranstaltungen beträgt 20 Personen. Für kleinere Gruppen empfehlen wir reguläre Reservierungen.'
      },
      q2: {
        question: 'Bieten Sie vegetarische und vegane Optionen an?',
        answer: 'Ja, wir haben ein vollständiges Menü mit vegetarischen und veganen Optionen. Wir können auch Menüs nach Ihren Ernährungsbedürfnissen anpassen.'
      }
    },
    navbar: {
      home: 'Startseite',
      menu: 'Menü',
      orders: 'Bestellungen',
      reservations: 'Reservierungen',
      account: 'Konto',
      profile: 'Profil',
      login: 'Anmelden',
      register: 'Registrieren',
      orderNow: 'Jetzt Bestellen',
      toggleLanguage: 'Sprache wechseln',
      toggleTheme: 'Theme wechseln',
      close: 'Schließen'
    },
    footer: {
      tagline: 'Authentische mexikanische Aromen, moderne Erfahrung.',
      quickLinks: 'Schnelllinks',
      contact: 'Kontakt',
      newsletter: 'Erhalten Sie 20% Rabatt auf Ihre erste Bestellung + exklusive Angebote 📧',
      emailPlaceholder: 'E-Mail-Adresse',
      join: 'Beitreten',
      privacy: 'Datenschutz',
      terms: 'AGB',
      copyright: '© {{year}} {{brand}}. Alle Rechte vorbehalten.'
    },
    faq: {
      heading: 'Häufig Gestellte Fragen',
      q1: {
        question: 'Wie lange dauert die Lieferung?',
        answer: 'Unsere durchschnittliche Lieferzeit beträgt 25-35 Minuten. Wir verwenden Echtzeit-Tracking, damit Sie genau sehen können, wann Ihre Bestellung ankommt.'
      },
      q2: {
        question: 'Bieten Sie vegetarische und vegane Optionen an?',
        answer: 'Ja! Wir haben eine große Auswahl an vegetarischen und veganen Gerichten. Unser Menü umfasst pflanzliche Tacos, Bowls und Beilagen.'
      },
      q3: {
        question: 'Kann ich meine Bestellung anpassen?',
        answer: 'Absolut! Sie können jedes Gericht anpassen, indem Sie Zutaten hinzufügen oder entfernen. Teilen Sie uns einfach Ihre Vorlieben bei der Bestellung mit.'
      }
    },
    popular: {
      heading: 'Diese Woche Beliebt',
      seeMenu: 'Vollständiges Menü Anzeigen',
      coming: 'Demnächst Verfügbar',
      chefSpecial: 'Chef-Spezial {{num}}',
      notify: 'Benachrichtigen Sie Mich',
      rating: '4.9/5 von über 2,400 Einheimischen'
    },
    auth: {
      loginSuccess: 'Anmeldung erfolgreich',
      loginFailed: 'Anmeldung fehlgeschlagen',
      logoutSuccess: 'Abmeldung erfolgreich',
      registerSuccess: 'Registrierung erfolgreich',
      registerFailed: 'Registrierung fehlgeschlagen',
      invalidCredentials: 'Ungültige Anmeldedaten',
      accountLocked: 'Konto ist gesperrt',
      accountNotVerified: 'Konto ist nicht verifiziert',
      passwordResetSent: 'Link zum Zurücksetzen des Passworts an Ihre E-Mail gesendet',
      passwordResetSuccess: 'Passwort erfolgreich zurückgesetzt',
      passwordResetFailed: 'Passwort-Reset fehlgeschlagen',
      tokenExpired: 'Token ist abgelaufen',
      tokenInvalid: 'Ungültiger Token',
      accessDenied: 'Zugriff verweigert',
      sessionExpired: 'Sitzung ist abgelaufen',
      emailAlreadyExists: 'E-Mail existiert bereits',
      usernameAlreadyExists: 'Benutzername existiert bereits',
      accountCreated: 'Konto erfolgreich erstellt',
      verificationEmailSent: 'Verifizierungs-E-Mail gesendet',
      emailVerified: 'E-Mail erfolgreich verifiziert',
      invalidVerificationToken: 'Ungültiger Verifizierungs-Token'
    },
    api: {
      dataRetrieved: 'Daten erfolgreich abgerufen',
      dataUpdated: 'Daten erfolgreich aktualisiert',
      dataCreated: 'Daten erfolgreich erstellt',
      dataDeleted: 'Daten erfolgreich gelöscht',
      noDataFound: 'Keine Daten gefunden',
      invalidApiKey: 'Ungültiger API-Schlüssel',
      apiKeyExpired: 'API-Schlüssel ist abgelaufen',
      apiKeyRequired: 'API-Schlüssel erforderlich',
      quotaExceeded: 'API-Kontingent überschritten',
      methodNotAllowed: 'Methode nicht erlaubt',
      unsupportedMediaType: 'Nicht unterstützter Medientyp',
      payloadTooLarge: 'Nutzlast zu groß',
      requestEntityTooLarge: 'Anfrage-Entität zu groß',
      contentTypeRequired: 'Content-Type-Header erforderlich',
      jsonParseError: 'Ungültiges JSON-Format',
      missingRequiredField: 'Erforderliches Feld fehlt: {{field}}',
      invalidFieldValue: 'Ungültiger Wert für Feld: {{field}}',
      duplicateEntry: 'Doppelter Eintrag gefunden',
      constraintViolation: 'Datenbank-Constraint-Verletzung',
      connectionError: 'Datenbankverbindungsfehler',
      checkApiDocsAction: 'Überprüfen Sie die URL oder konsultieren Sie die API-Dokumentation für gültige Endpunkte.'
    },
    validation: {
      required: '{{field}} ist erforderlich',
      email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
      minLength: '{{field}} muss mindestens {{min}} Zeichen lang sein',
      maxLength: '{{field}} darf {{max}} Zeichen nicht überschreiten',
      passwordStrength: 'Das Passwort muss mindestens 8 Zeichen, einen Großbuchstaben, einen Kleinbuchstaben und eine Zahl enthalten',
      passwordMatch: 'Passwörter stimmen nicht überein',
      invalidFormat: 'Ungültiges Format für {{field}}',
      invalidDate: 'Ungültiges Datumsformat',
      futureDateRequired: 'Datum muss in der Zukunft liegen',
      pastDateRequired: 'Datum muss in der Vergangenheit liegen',
      invalidPhone: 'Ungültiges Telefonnummernformat',
      invalidUrl: 'Ungültiges URL-Format',
      numericOnly: '{{field}} darf nur Zahlen enthalten',
      alphabeticOnly: '{{field}} darf nur Buchstaben enthalten',
      alphanumericOnly: '{{field}} darf nur Buchstaben und Zahlen enthalten',
      invalidRange: '{{field}} muss zwischen {{min}} und {{max}} liegen',
      fileRequired: 'Datei ist erforderlich',
      invalidFileType: 'Ungültiger Dateityp. Erlaubte Typen: {{types}}',
      fileSizeExceeded: 'Dateigröße darf {{maxSize}} nicht überschreiten',
      invalidImageFormat: 'Ungültiges Bildformat',
      duplicateValue: '{{field}} existiert bereits'
    },
    email: {
      subject: {
        welcome: 'Willkommen bei {{appName}}',
        passwordReset: 'Passwort-Reset-Anfrage',
        emailVerification: 'Verifizieren Sie Ihre E-Mail-Adresse',
        accountLocked: 'Konto-Sicherheitswarnung',
        loginAlert: 'Neue Anmeldung Erkannt'
      },
      greeting: 'Hallo {{name}},',
      welcomeMessage: 'Willkommen bei {{appName}}! Wir freuen uns, Sie bei uns zu haben.',
      passwordResetMessage: 'Sie haben einen Passwort-Reset angefordert. Klicken Sie auf den Link unten, um fortzufahren:',
      verificationMessage: 'Bitte verifizieren Sie Ihre E-Mail-Adresse, indem Sie auf den Link unten klicken:',
      accountLockedMessage: 'Ihr Konto wurde vorübergehend gesperrt, da mehrere fehlgeschlagene Anmeldeversuche vorliegen.',
      loginAlertMessage: 'Wir haben eine neue Anmeldung zu Ihrem Konto von {{location}} um {{time}} erkannt.',
      footer: 'Wenn Sie dies nicht angefordert haben, ignorieren Sie bitte diese E-Mail oder kontaktieren Sie den Support.',
      buttonText: {
        resetPassword: 'Passwort Zurücksetzen',
        verifyEmail: 'E-Mail Verifizieren',
        contactSupport: 'Support Kontaktieren'
      },
      expiryNotice: 'Dieser Link läuft in {{hours}} Stunden ab.',
      supportContact: 'Wenn Sie Hilfe benötigen, kontaktieren Sie uns bitte unter {{email}}'
    },
    business: {
      menu: {
        itemCreated: 'Menüpunkt erfolgreich erstellt',
        itemUpdated: 'Menüpunkt erfolgreich aktualisiert',
        itemDeleted: 'Menüpunkt erfolgreich gelöscht',
        itemNotFound: 'Menüpunkt nicht gefunden',
        categoryCreated: 'Menükategorie erfolgreich erstellt',
        categoryUpdated: 'Menükategorie erfolgreich aktualisiert',
        categoryDeleted: 'Menükategorie erfolgreich gelöscht',
        categoryNotFound: 'Menükategorie nicht gefunden',
        itemOutOfStock: 'Menüpunkt ist ausverkauft',
        invalidPrice: 'Ungültiger Preis angegeben',
        duplicateItem: 'Menüpunkt existiert bereits'
      },
      orders: {
        orderCreated: 'Bestellung erfolgreich erstellt',
        orderUpdated: 'Bestellung erfolgreich aktualisiert',
        orderCancelled: 'Bestellung erfolgreich storniert',
        orderNotFound: 'Bestellung nicht gefunden',
        orderStatusUpdated: 'Bestellstatus erfolgreich aktualisiert',
        invalidOrderStatus: 'Ungültiger Bestellstatus',
        orderAlreadyCancelled: 'Bestellung ist bereits storniert',
        orderCannotBeCancelled: 'Bestellung kann in diesem Stadium nicht storniert werden',
        paymentRequired: 'Zahlung ist erforderlich, um die Bestellung abzuschließen',
        insufficientInventory: 'Unzureichender Lagerbestand für einige Artikel',
        orderTotal: 'Bestellsumme: {{amount}}',
        estimatedDelivery: 'Geschätzte Lieferzeit: {{time}} Minuten'
      },
      reservations: {
        reservationCreated: 'Reservierung erfolgreich erstellt',
        reservationUpdated: 'Reservierung erfolgreich aktualisiert',
        reservationCancelled: 'Reservierung erfolgreich storniert',
        reservationNotFound: 'Reservierung nicht gefunden',
        reservationConfirmed: 'Reservierung bestätigt',
        tableNotAvailable: 'Tisch ist zur gewünschten Zeit nicht verfügbar',
        invalidReservationTime: 'Heure de réservation invalide',
        reservationTooEarly: 'L\'heure de réservation est trop éloignée dans le futur',
        reservationTooLate: 'L\'heure de réservation est déjà passée',
        capacityExceeded: 'La taille du groupe dépasse la capacité de la table'
      }
    },
    home: {
      hero: {
        badge: 'Neu: Belohnungen-Start — verdienen Sie Punkte bei jeder Bestellung',
        title: 'Authentisch mexikanisch. <primary>Schnell geliefert.</primary>',
        desc: 'Von Straßentacos bis zu langsam gekochten Spezialitäten. Bestellen Sie in Sekunden, reservieren Sie sofort einen Tisch und verfolgen Sie Ihre Lieferung in Echtzeit — alles an einem Ort.',
        orderNow: 'Jetzt Bestellen',
        reserve: 'Tisch Reservieren',
        browseMenu: 'Menü Durchsuchen',
        rating: '4.9/5 von über 2,400 Einheimischen',
        avgTime: '25-35 Min Durchschnitt',
        imageAlt: 'Bunte Tacos-Platte mit frischen Zutaten und lebendiger Salsa',
        card: {
          title: 'Täglich Frisch',
          desc: 'Nós nos abastecemos de ingredientes dos mercados locais todas as manhãs'
        }
      },
      explore: {
        heading: 'Entdecken Sie Unser Menü',
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
        heading: 'Fidelidade e Recompensas',
        membersSave: 'Membros economizam 10%',
        points: '1,250 pontos',
        nextAt: 'Próxima recompensa em {{points}}',
        freeDessert: 'Sobremesa grátis no seu aniversário',
        join: 'Participar Agora',
        perks: 'Ver Benefícios'
      },
      why: {
        heading: 'Por Que Escolher Cantina Mariachi',
        faster: {
          title: 'Mais rápido que aplicativos de entrega',
          desc: 'Diretamente da nossa cozinha para sua porta em 25-35 minutos'
        },
        fees: {
          title: 'Nenhuma taxa oculta',
          desc: 'Preços transparentes sem surpresas'
        },
        oneTap: {
          title: 'Refazer pedido com um toque',
          desc: 'Refaça seus favoritos com apenas um toque'
        },
        tracking: {
          title: 'Rastreamento ao vivo',
          desc: 'Veja exatamente quando sua comida chegará'
        },
        chef: {
          title: 'Qualidade de chef',
          desc: 'Cada prato preparado por nossos chefs especialistas'
        },
        rewards: {
          title: 'Ganhe recompensas',
          desc: 'Obtenha pontos em cada pedido e desbloqueie benefícios exclusivos'
        }
      },
      values: {
        heading: 'Nossos Valores e Abastecimento',
        desc: 'Estamos comprometidos com qualidade, sustentabilidade e apoio às comunidades locais através de abastecimento responsável e práticas ecológicas.',
        badges: {
          localProduce: 'Produtos Locais',
          sustainableSeafood: 'Frutos do Mar Sustentáveis',
          fairTrade: 'Comércio Justo',
          lowWaste: 'Baixo Desperdício'
        },
        cards: {
          dailyMarket: 'Fresco do Mercado Diário',
          houseSalsas: 'Salsas Caseiras',
          localTortillas: 'Tortillas Locais',
          compostablePackaging: 'Embalagem Compostável'
        }
      },
      value: {
        reorderDesc: 'Refaça seus favoritos em segundos',
        trustedTitle: 'Confiado por mais de 10,000 locais',
        trustedDesc: 'Junte-se a milhares de clientes satisfeitos'
      },
      how: {
        heading: 'Como Funciona',
        desc: 'Fazer pedidos com Cantina Mariachi é simples e rápido',
        step1: {
          title: 'Escolha Seus Favoritos',
          desc: 'Navegue pelo nosso cardápio e selecione seus pratos favoritos'
        },
        step2: {
          title: 'Faça Seu Pedido',
          desc: 'Personalize seu pedido e pague com segurança'
        },
        step3: {
          title: 'Rastreie e Aproveite',
          desc: 'Acompanhe seu pedido em tempo real e aproveite comida fresca'
        }
      },
      testimonials: {
        heading: 'O Que Nossos Clientes Dizem'
      },
      popular: {
        heading: 'Popular Esta Semana',
        seeMenu: 'Ver Cardápio Completo',
        coming: 'Em Breve',
        chefSpecial: 'Especial do Chef {{num}}',
        notify: 'Me Notifique',
        rating: '4.9/5 de mais de 2,400 locais'
      },
      faq: {
        heading: 'Perguntas Frequentes',
        q1: {
          question: 'Qual é o tempo de entrega?',
          answer: 'Nosso tempo médio de entrega é de 25-35 minutos. Usamos rastreamento em tempo real para você ver exatamente quando seu pedido chegará.'
        },
        q2: {
          question: 'Vocês oferecem opções vegetarianas e veganas?',
          answer: 'Sim! Temos uma ampla seleção de pratos vegetarianos e veganos. Nosso cardápio inclui tacos, bowls e acompanhamentos à base de plantas.'
        },
        q3: {
          question: 'Posso personalizar meu pedido?',
          answer: 'Absolutamente! Você pode personalizar qualquer prato adicionando ou removendo ingredientes. Apenas nos informe suas preferências ao fazer o pedido.'
        }
      },
      cta: {
        endsTonight: '⚡ Termina Esta Noite',
        title: 'Tempo Limitado: Pacote Taco Tuesday',
        desc: '2 tacos + bebida por apenas R$ 9,99. Perfeito para compartilhar ou manter tudo para você.',
        socialProof: '🔥 Mais de 2,400 pedidos esta semana',
        limited: 'Oferta por Tempo Limitado',
        start: 'Começar a Fazer Pedidos',
        reserve: 'Reservar Mesa'
      },
      sticky: {
        order: 'Fazer Pedido Agora',
        reserve: 'Reservar'
      },
      logo: {
        heading: 'Confiado por empresas locais e amantes da comida'
      },
      offers: {
        heading: 'Ofertas Sazonais',
        badge: 'Tempo limitado',
        bundle: 'Pacote Taco Tuesday',
        deal: '2 tacos + bebida — R$ 9,99',
        endsIn: 'Termina em',
        orderBundle: 'Pedir pacote',
        viewDetails: 'Ver detalhes',
        coming: 'Novas ofertas estão chegando em breve.',
        freeDelivery: 'Só hoje: entrega grátis em pedidos acima de R$ 25'
      },
      events: {
        heading: 'Eventos e Catering',
        desc: 'Organizamos eventos especiais e serviços de catering para grandes grupos. De aniversários a eventos corporativos.',
        plan: 'Planejar Evento',
        catering: 'Serviço de Catering',
        q1: {
          question: 'Qual é o tamanho mínimo do grupo para eventos?',
          answer: 'Nosso tamanho mínimo de grupo para eventos é de 20 pessoas. Para grupos menores, recomendamos reservas regulares.'
        },
        q2: {
          question: 'Vocês oferecem opções vegetarianas e veganas?',
          answer: 'Sim, temos um cardápio completo de opções vegetarianas e veganas. Também podemos personalizar cardápios de acordo com suas necessidades dietéticas.'
        }
      }
    }
  },
  
  // Italian translations
  it: {
    common: {
      success: 'Successo',
      error: 'Errore',
      statusSuccess: 'successo',
      statusError: 'errore',
      welcome: 'Benvenuto',
      loading: 'Caricamento...',
      notFound: 'Non trovato',
      unauthorized: 'Accesso non autorizzato',
      forbidden: 'Accesso vietato',
      internalError: 'Errore interno del server',
      badRequest: 'Richiesta non valida',
      created: 'Creato con successo',
      updated: 'Aggiornato con successo',
      deleted: 'Eliminato con successo',
      operationFailed: 'Operazione fallita',
      invalidRequest: 'Richiesta non valida',
      resourceNotFound: 'Risorsa non trovata',
      serverError: 'Errore del server',
      maintenance: 'Il server è in manutenzione',
      rateLimited: 'Troppe richieste. Riprova più tardi.',
      timeout: 'Timeout della richiesta',
      dataRetrieved: 'Dati recuperati con successo',
      languageUpdated: 'Lingua aggiornata con successo',
      languageReset: 'Lingua reimpostata al valore predefinito con successo'
    },
    ui: {
      brand: 'Cantina Mariachi',
      nav: {
        home: 'Home',
        menu: 'Menu',
        orders: 'Ordini',
        reservations: 'Prenotazioni',
        account: 'Account',
        profile: 'Profilo',
        login: 'Accedi',
        register: 'Registrati',
        orderNow: 'Ordina Ora'
      },
      topbar: {
        open: 'Aperto',
        closed: 'Chiuso',
        eta: '{{mins}} min',
        noSignup: 'Nessuna registrazione richiesta',
        browse: 'Sfoglia Menu'
      },
      a11y: {
        toggleLanguage: 'Cambia lingua'
      },
      footer: {
        tagline: 'Sapori messicani autentici, esperienza moderna.',
        quickLinks: 'Link Rapidi',
        contact: 'Contatto',
        newsletter: 'Ottieni 20% di sconto sul tuo primo ordine + offerte esclusive 📧',
        emailPlaceholder: 'Indirizzo email',
        join: 'Unisciti',
        privacy: 'Privacy',
        terms: 'Termini',
        copyright: '© {{year}} {{brand}}. Tutti i diritti riservati.'
      }
    },
    events: {
      heading: 'Eventi e Catering',
      desc: 'Organizziamo eventi speciali e servizi di catering per grandi gruppi. Dai compleanni agli eventi aziendali.',
      plan: 'Pianifica Evento',
      catering: 'Servizio Catering',
      q1: {
        question: 'Qual è la dimensione minima del gruppo per gli eventi?',
        answer: 'La nostra dimensione minima del gruppo per gli eventi è di 20 persone. Per gruppi più piccoli, raccomandiamo prenotazioni regolari.'
      },
      q2: {
        question: 'Offrite opzioni vegetariane e vegane?',
        answer: 'Sì, abbiamo un menu completo di opzioni vegetariane e vegane. Possiamo anche personalizzare i menu secondo le vostre esigenze dietetiche.'
      }
    },
    navbar: {
      home: 'Home',
      menu: 'Menu',
      orders: 'Ordini',
      reservations: 'Prenotazioni',
      account: 'Account',
      profile: 'Profilo',
      login: 'Accedi',
      register: 'Registrati',
      orderNow: 'Ordina Ora',
      toggleLanguage: 'Cambia lingua',
      toggleTheme: 'Cambia tema',
      close: 'Chiudi'
    },
    footer: {
      tagline: 'Sapori messicani autentici, esperienza moderna.',
      quickLinks: 'Link Rapidi',
      contact: 'Contatto',
      newsletter: 'Ottieni 20% di sconto sul tuo primo ordine + offerte esclusive 📧',
      emailPlaceholder: 'Indirizzo email',
      join: 'Unisciti',
      privacy: 'Privacy',
      terms: 'Termini',
      copyright: '© {{year}} {{brand}}. Tutti i diritti riservati.'
    },
    faq: {
      heading: 'Domande Frequenti',
      q1: {
        question: 'Qual è il tempo di consegna?',
        answer: 'Il nostro tempo di consegna medio è di 25-35 minuti. Utilizziamo il tracking in tempo reale per farti vedere esattamente quando arriverà il tuo ordine.'
      },
      q2: {
        question: 'Offrite opzioni vegetariane e vegane?',
        answer: 'Sì! Abbiamo una vasta selezione di piatti vegetariani e vegani. Il nostro menu include tacos, bowl e contorni a base vegetale.'
      },
      q3: {
        question: 'Posso personalizzare il mio ordine?',
        answer: 'Assolutamente! Puoi personalizzare qualsiasi piatto aggiungendo o rimuovendo ingredienti. Faccelo semplicemente sapere le tue preferenze quando ordini.'
      }
    },
    popular: {
      heading: 'Popolare Questa Settimana',
      seeMenu: 'Vedi Menu Completo',
      coming: 'Prossimamente',
      chefSpecial: 'Speciale dello Chef {{num}}',
      notify: 'Notificami',
      rating: '4.9/5 da oltre 2,400 locali'
    },
    auth: {
      loginSuccess: 'Accesso riuscito',
      loginFailed: 'Accesso fallito',
      logoutSuccess: 'Disconnessione riuscita',
      registerSuccess: 'Registrazione riuscita',
      registerFailed: 'Registrazione fallita',
      invalidCredentials: 'Credenziali non valide',
      accountLocked: 'L\'account è bloccato',
      accountNotVerified: 'L\'account non è verificato',
      passwordResetSent: 'Link per il reset della password inviato alla tua email',
      passwordResetSuccess: 'Reset della password riuscito',
      passwordResetFailed: 'Reset della password fallito',
      tokenExpired: 'Il token è scaduto',
      tokenInvalid: 'Token non valido',
      accessDenied: 'Accesso negato',
      sessionExpired: 'La sessione è scaduta',
      emailAlreadyExists: 'L\'email esiste già',
      usernameAlreadyExists: 'Il nome utente esiste già',
      accountCreated: 'Account creato con successo',
      verificationEmailSent: 'Email di verifica inviata',
      emailVerified: 'Email verificata con successo',
      invalidVerificationToken: 'Token di verifica non valido'
    },
    api: {
      dataRetrieved: 'Dati recuperati con successo',
      dataUpdated: 'Dati aggiornati con successo',
      dataCreated: 'Dati creati con successo',
      dataDeleted: 'Dati eliminati con successo',
      noDataFound: 'Nessun dato trovato',
      invalidApiKey: 'Chiave API non valida',
      apiKeyExpired: 'La chiave API è scaduta',
      apiKeyRequired: 'Chiave API richiesta',
      quotaExceeded: 'Quota API superata',
      methodNotAllowed: 'Metodo non consentito',
      unsupportedMediaType: 'Tipo di media non supportato',
      payloadTooLarge: 'Carico utile troppo grande',
      requestEntityTooLarge: 'Entità richiesta troppo grande',
      contentTypeRequired: 'Header Content-Type richiesto',
      jsonParseError: 'Formato JSON non valido',
      missingRequiredField: 'Campo richiesto mancante: {{field}}',
      invalidFieldValue: 'Valore non valido per il campo: {{field}}',
      duplicateEntry: 'Voce duplicata trovata',
      constraintViolation: 'Violazione del vincolo del database',
      connectionError: 'Errore di connessione al database',
      checkApiDocsAction: 'Controlla l\'URL o consulta la documentazione API per endpoint validi.'
    },
    validation: {
      required: '{{field}} è richiesto',
      email: 'Inserisci un indirizzo email valido',
      minLength: '{{field}} deve contenere almeno {{min}} caratteri',
      maxLength: '{{field}} non deve superare {{max}} caratteri',
      passwordStrength: 'La password deve contenere almeno 8 caratteri, una lettera maiuscola, una minuscola e un numero',
      passwordMatch: 'Le password non corrispondono',
      invalidFormat: 'Formato non valido per {{field}}',
      invalidDate: 'Formato data non valido',
      futureDateRequired: 'La data deve essere nel futuro',
      pastDateRequired: 'La data deve essere nel passato',
      invalidPhone: 'Formato numero di telefono non valido',
      invalidUrl: 'Formato URL non valido',
      numericOnly: '{{field}} deve contenere solo numeri',
      alphabeticOnly: '{{field}} deve contenere solo lettere',
      alphanumericOnly: '{{field}} deve contenere solo lettere e numeri',
      invalidRange: '{{field}} deve essere tra {{min}} e {{max}}',
      fileRequired: 'Il file è richiesto',
      invalidFileType: 'Tipo di file non valido. Tipi consentiti: {{types}}',
      fileSizeExceeded: 'La dimensione del file non deve superare {{maxSize}}',
      invalidImageFormat: 'Formato immagine non valido',
      duplicateValue: '{{field}} esiste già'
    },
    email: {
      subject: {
        welcome: 'Benvenuto su {{appName}}',
        passwordReset: 'Richiesta Reset Password',
        emailVerification: 'Verifica il Tuo Indirizzo Email',
        accountLocked: 'Avviso Sicurezza Account',
        loginAlert: 'Nuovo Accesso Rilevato'
      },
      greeting: 'Ciao {{name}},',
      welcomeMessage: 'Benvenuto su {{appName}}! Siamo entusiasti di averti con noi.',
      passwordResetMessage: 'Hai richiesto un reset della password. Clicca sul link qui sotto per continuare:',
      verificationMessage: 'Verifica il tuo indirizzo email cliccando sul link qui sotto:',
      accountLockedMessage: 'Il tuo account è stato temporaneamente bloccato a causa di diversi tentativi di accesso falliti.',
      loginAlertMessage: 'Abbiamo rilevato un nuovo accesso al tuo account da {{location}} alle {{time}}.',
      footer: 'Se non hai richiesto questo, ignora questa email o contatta il supporto.',
      buttonText: {
        resetPassword: 'Reset Password',
        verifyEmail: 'Verifica Email',
        contactSupport: 'Contatta Supporto'
      },
      expiryNotice: 'Questo link scadrà in {{hours}} ore.',
      supportContact: 'Se hai bisogno di aiuto, contattaci a {{email}}'
    },
    business: {
      menu: {
        itemCreated: 'Elemento del menu creato con successo',
        itemUpdated: 'Elemento del menu aggiornato con successo',
        itemDeleted: 'Elemento del menu eliminato con successo',
        itemNotFound: 'Elemento del menu non trovato',
        categoryCreated: 'Categoria del menu creata con successo',
        categoryUpdated: 'Categoria del menu aggiornata con successo',
        categoryDeleted: 'Categoria del menu eliminata con successo',
        categoryNotFound: 'Categoria del menu non trovata',
        itemOutOfStock: 'Elemento del menu esaurito',
        invalidPrice: 'Prezzo non valido specificato',
        duplicateItem: 'L\'elemento del menu esiste già'
      },
      orders: {
        orderCreated: 'Ordine creato con successo',
        orderUpdated: 'Ordine aggiornato con successo',
        orderCancelled: 'Ordine cancellato con successo',
        orderNotFound: 'Ordine non trovato',
        orderStatusUpdated: 'Stato dell\'ordine aggiornato con successo',
        invalidOrderStatus: 'Stato ordine non valido',
        orderAlreadyCancelled: 'L\'ordine è già stato cancellato',
        orderCannotBeCancelled: 'L\'ordine non può essere cancellato in questa fase',
        paymentRequired: 'Il pagamento è richiesto per completare l\'ordine',
        insufficientInventory: 'Inventario insufficiente per alcuni articoli',
        orderTotal: 'Totale ordine: {{amount}}',
        estimatedDelivery: 'Tempo di consegna stimato: {{time}} minuti'
      },
      reservations: {
        reservationCreated: 'Prenotazione creata con successo',
        reservationUpdated: 'Prenotazione aggiornata con successo',
        reservationCancelled: 'Prenotazione cancellata con successo',
        reservationNotFound: 'Prenotazione non trovata',
        reservationConfirmed: 'Prenotazione confermata',
        tableNotAvailable: 'Il tavolo non è disponibile all\'ora richiesta',
        invalidReservationTime: 'Ora prenotazione non valida',
        reservationTooEarly: 'L\'ora di prenotazione è troppo lontana nel futuro',
        reservationTooLate: 'L\'ora di prenotazione è già passata',
        capacityExceeded: 'La dimensione del gruppo supera la capacità del tavolo'
      }
    },
    home: {
      hero: {
        badge: 'Nuovo: Lancio ricompense — guadagna punti su ogni ordine',
        title: 'Messicano autentico. <primary>Consegnato velocemente.</primary>',
        desc: 'Dai tacos stile strada alle specialità cucinate lentamente. Ordina in secondi, prenota un tavolo istantaneamente e traccia la tua consegna in tempo reale — tutto in un posto.',
        orderNow: 'Ordina Ora',
        reserve: 'Prenota Tavolo',
        browseMenu: 'Sfoglia Menu',
        rating: '4.9/5 da oltre 2,400 locali',
        avgTime: '25-35 min media',
        imageAlt: 'Piatto colorato di tacos con ingredienti freschi e salsa vibrante',
        card: {
          title: 'Fresco Quotidiano',
          desc: 'Ci riforniamo di ingredienti dai mercati locali ogni mattina'
        }
      },
      explore: {
        heading: 'Esplora il Nostro Menu',
        tacos: 'Tacos',
        bowls: 'Bowl',
        drinks: 'Bevande',
        coming: 'Prossimamente',
        viewMore: 'Vedi Menu Completo',
        tabs: {
          tacos: 'Tacos',
          bowls: 'Bowl',
          drinks: 'Bevande'
        }
      },
      loyalty: {
        heading: 'Fedeltà e Ricompense',
        membersSave: 'I membri risparmiano 10%',
        points: '1,250 punti',
        nextAt: 'Prossima ricompensa a {{points}}',
        freeDessert: 'Dolce gratuito per il tuo compleanno',
        join: 'Unisciti Ora',
        perks: 'Vedi Vantaggi'
      },
      why: {
        heading: 'Perché Scegliere Cantina Mariachi',
        faster: {
          title: 'Più veloce delle app di consegna',
          desc: 'Direttamente dalla nostra cucina alla tua porta in 25-35 minuti'
        },
        fees: {
          title: 'Nessuna tassa nascosta',
          desc: 'Prezzi trasparenti senza sorprese'
        },
        oneTap: {
          title: 'Riordino con un tap',
          desc: 'Riordina i tuoi preferiti con un solo tap'
        },
        tracking: {
          title: 'Tracciamento live',
          desc: 'Vedi esattamente quando arriverà il tuo cibo'
        },
        chef: {
          title: 'Qualità chef',
          desc: 'Ogni piatto preparato dai nostri chef esperti'
        },
        rewards: {
          title: 'Guadagna ricompense',
          desc: 'Ottieni punti su ogni ordine e sblocca vantaggi esclusivi'
        }
      },
      values: {
        heading: 'I Nostri Valori e Approvvigionamento',
        desc: 'Ci impegniamo per la qualità, la sostenibilità e il supporto alle comunità locali attraverso un approvvigionamento responsabile e pratiche eco-compatibili.',
        badges: {
          localProduce: 'Prodotti Locali',
          sustainableSeafood: 'Frutti di Mer Sostenibili',
          fairTrade: 'Commercio Equo',
          lowWaste: 'Basso Spreco'
        },
        cards: {
          dailyMarket: 'Fresco dal Mercato Quotidiano',
          houseSalsas: 'Salse Fatte in Casa',
          localTortillas: 'Lokale Tortillas',
          compostablePackaging: 'Imballaggio Compostabile'
        }
      },
      value: {
        reorderDesc: 'Riordina i tuoi preferiti in secondi',
        trustedTitle: 'Fidato da oltre 10,000 locali',
        trustedDesc: 'Unisciti a migliaia di clienti soddisfatti'
      },
      how: {
        heading: 'Come Funziona',
        desc: 'Ordinare con Cantina Mariachi è semplice e veloce',
        step1: {
          title: 'Scegli i Tuoi Preferiti',
          desc: 'Sfoglia il nostro menu e seleziona i tuoi piatti preferiti'
        },
        step2: {
          title: 'Piazza il Tuo Ordine',
          desc: 'Personalizza il tuo ordine e paga in sicurezza'
        },
        step3: {
          title: 'Traccia e Goditi',
          desc: 'Segui il tuo ordine in tempo reale e goditi cibo fresco'
        }
      },
      testimonials: {
        heading: 'Cosa Dicono i Nostri Clienti'
      },
      popular: {
        heading: 'Popolare Questa Settimana',
        seeMenu: 'Vedi Menu Completo',
        coming: 'Prossimamente',
        chefSpecial: 'Speciale dello Chef {{num}}',
        notify: 'Notificami',
        rating: '4.9/5 da oltre 2,400 locali'
      },
      faq: {
        heading: 'Domande Frequenti',
        q1: {
          question: 'Qual è il tempo di consegna?',
          answer: 'Il nostro tempo di consegna medio è di 25-35 minuti. Utilizziamo il tracking in tempo reale per farti vedere esattamente quando arriverà il tuo ordine.'
        },
        q2: {
          question: 'Offrite opzioni vegetariane e vegane?',
          answer: 'Sì! Abbiamo una vasta selezione di piatti vegetariani e vegani. Il nostro menu include tacos, bowl e contorni a base vegetale.'
        },
        q3: {
          question: 'Posso personalizzare il mio ordine?',
          answer: 'Assolutamente! Puoi personalizzare qualsiasi piatto aggiungendo o rimuovendo ingredienti. Faccelo semplicemente sapere le tue preferenze quando ordini.'
        }
      },
      cta: {
        endsTonight: '⚡ Finisce Stasera',
        title: 'Tempo Limitato: Pacchetto Taco Tuesday',
        desc: '2 tacos + bevanda per solo 9,99€. Perfetto per condividere o tenere tutto per te.',
        socialProof: '🔥 Oltre 2,400 ordini questa settimana',
        limited: 'Offerta a Tempo Limitato',
        start: 'Inizia a Ordinare',
        reserve: 'Prenota Tavolo'
      },
      sticky: {
        order: 'Ordina Ora',
        reserve: 'Prenota'
      },
      logo: {
        heading: 'Fidato da aziende locali e amanti del cibo'
      },
      offers: {
        heading: 'Offerte Stagionali',
        badge: 'Tempo limitato',
        bundle: 'Pacchetto Taco Tuesday',
        deal: '2 tacos + bevanda — 9,99€',
        endsIn: 'Finisce in',
        orderBundle: 'Ordina pacchetto',
        viewDetails: 'Vedi dettagli',
        coming: 'Nuove offerte stanno arrivando presto.',
        freeDelivery: 'Solo oggi: consegna gratuita su ordini superiori a 25€'
      },
      events: {
        heading: 'Eventi e Catering',
        desc: 'Organizziamo eventi speciali e servizi di catering per grandi gruppi. Dai compleanni agli eventi aziendali.',
        plan: 'Pianifica Evento',
        catering: 'Servizio Catering',
        q1: {
          question: 'Qual è la dimensione minima del gruppo per gli eventi?',
          answer: 'La nostra dimensione minima del gruppo per gli eventi è di 20 persone. Per gruppi più piccoli, raccomandiamo prenotazioni regolari.'
        },
        q2: {
          question: 'Offrite opzioni vegetariane e vegane?',
          answer: 'Sì, abbiamo un menu completo di opzioni vegetariane e vegane. Possiamo anche personalizzare i menu secondo le vostre esigenze dietetiche.'
        }
      }
    }
  },
  
  // Portuguese translations
  pt: {
    common: {
      success: 'Sucesso',
      error: 'Erro',
      statusSuccess: 'sucesso',
      statusError: 'erro',
      welcome: 'Bem-vindo',
      loading: 'Carregando...',
      notFound: 'Não encontrado',
      unauthorized: 'Acesso não autorizado',
      forbidden: 'Acesso proibido',
      internalError: 'Erro interno do servidor',
      badRequest: 'Requisição inválida',
      created: 'Criado com sucesso',
      updated: 'Atualizado com sucesso',
      deleted: 'Excluído com sucesso',
      operationFailed: 'Operação falhou',
      invalidRequest: 'Requisição inválida',
      resourceNotFound: 'Recurso não encontrado',
      serverError: 'Erro do servidor',
      maintenance: 'Servidor em manutenção',
      rateLimited: 'Muitas requisições. Tente novamente mais tarde.',
      timeout: 'Timeout da requisição',
      dataRetrieved: 'Dados recuperados com sucesso',
      languageUpdated: 'Idioma atualizado com sucesso',
      languageReset: 'Idioma redefinido para o padrão com sucesso'
    },
    ui: {
      brand: 'Cantina Mariachi',
      nav: {
        home: 'Início',
        menu: 'Cardápio',
        orders: 'Pedidos',
        reservations: 'Reservas',
        account: 'Conta',
        profile: 'Perfil',
        login: 'Entrar',
        register: 'Registrar',
        orderNow: 'Fazer Pedido Agora'
      },
      topbar: {
        open: 'Aberto',
        closed: 'Fechado',
        eta: '{{mins}} min',
        noSignup: 'Nenhum cadastro necessário',
        browse: 'Ver Cardápio'
      },
      a11y: {
        toggleLanguage: 'Alternar idioma'
      },
      footer: {
        tagline: 'Sabores mexicanos autênticos, experiência moderna.',
        quickLinks: 'Links Rápidos',
        contact: 'Contato',
        newsletter: 'Obtenha 20% de desconto no seu primeiro pedido + ofertas exclusivas 📧',
        emailPlaceholder: 'Endereço de email',
        join: 'Participar',
        privacy: 'Privacidade',
        terms: 'Termos',
        copyright: '© {{year}} {{brand}}. Todos os direitos reservados.'
      }
    },
    events: {
      heading: 'Eventos e Catering',
      desc: 'Organizamos eventos especiais e serviços de catering para grandes grupos. De aniversários a eventos corporativos.',
      plan: 'Planejar Evento',
      catering: 'Serviço de Catering',
      q1: {
        question: 'Qual é o tamanho mínimo do grupo para eventos?',
        answer: 'Nosso tamanho mínimo de grupo para eventos é de 20 pessoas. Para grupos menores, recomendamos reservas regulares.'
      },
      q2: {
        question: 'Vocês oferecem opções vegetarianas e veganas?',
        answer: 'Sim, temos um cardápio completo de opções vegetarianas e veganas. Também podemos personalizar cardápios de acordo com suas necessidades dietéticas.'
      }
    },
    navbar: {
      home: 'Início',
      menu: 'Cardápio',
      orders: 'Pedidos',
      reservations: 'Reservas',
      account: 'Conta',
      profile: 'Perfil',
      login: 'Entrar',
      register: 'Registrar',
      orderNow: 'Fazer Pedido Agora',
      toggleLanguage: 'Alternar idioma',
      toggleTheme: 'Alternar tema',
      close: 'Fechar'
    },
    footer: {
      tagline: 'Sabores mexicanos autênticos, experiência moderna.',
      quickLinks: 'Links Rápidos',
      contact: 'Contato',
      newsletter: 'Obtenha 20% de desconto no seu primeiro pedido + ofertas exclusivas 📧',
      emailPlaceholder: 'Endereço de email',
      join: 'Participar',
      privacy: 'Privacidade',
      terms: 'Termos',
      copyright: '© {{year}} {{brand}}. Todos os direitos reservados.'
    },
    faq: {
      heading: 'Perguntas Frequentes',
      q1: {
        question: 'Qual é o tempo de entrega?',
        answer: 'Nosso tempo médio de entrega é de 25-35 minutos. Usamos rastreamento em tempo real para você ver exatamente quando seu pedido chegará.'
      },
      q2: {
        question: 'Vocês oferecem opções vegetarianas e veganas?',
        answer: 'Sim! Temos uma ampla seleção de pratos vegetarianos e veganos. Nosso cardápio inclui tacos, bowls e acompanhamentos à base de plantas.'
      },
      q3: {
        question: 'Posso personalizar meu pedido?',
        answer: 'Absolutamente! Você pode personalizar qualquer prato adicionando ou removendo ingredientes. Apenas nos informe suas preferências ao fazer o pedido.'
      }
    },
    popular: {
      heading: 'Popular Esta Semana',
      seeMenu: 'Ver Cardápio Completo',
      coming: 'Em Breve',
      chefSpecial: 'Especial do Chef {{num}}',
      notify: 'Me Notifique',
      rating: '4.9/5 de mais de 2,400 locais'
    },
    auth: {
      loginSuccess: 'Login realizado com sucesso',
      loginFailed: 'Falha no login',
      logoutSuccess: 'Logout realizado com sucesso',
      registerSuccess: 'Registro realizado com sucesso',
      registerFailed: 'Falha no registro',
      invalidCredentials: 'Credenciais inválidas',
      accountLocked: 'Conta está bloqueada',
      accountNotVerified: 'Conta não está verificada',
      passwordResetSent: 'Link para redefinir senha enviado para seu email',
      passwordResetSuccess: 'Redefinição de senha realizada com sucesso',
      passwordResetFailed: 'Falha na redefinição de senha',
      tokenExpired: 'Token expirou',
      tokenInvalid: 'Token inválido',
      accessDenied: 'Acesso negado',
      sessionExpired: 'Sessão expirou',
      emailAlreadyExists: 'Email já existe',
      usernameAlreadyExists: 'Nome de usuário já existe',
      accountCreated: 'Conta criada com sucesso',
      verificationEmailSent: 'Email de verificação enviado',
      emailVerified: 'Email verificado com sucesso',
      invalidVerificationToken: 'Token de verificação inválido'
    },
    api: {
      dataRetrieved: 'Dados recuperados com sucesso',
      dataUpdated: 'Dados atualizados com sucesso',
      dataCreated: 'Dados criados com sucesso',
      dataDeleted: 'Dados excluídos com sucesso',
      noDataFound: 'Nenhum dado encontrado',
      invalidApiKey: 'Chave API inválida',
      apiKeyExpired: 'Chave API expirou',
      apiKeyRequired: 'Chave API necessária',
      quotaExceeded: 'Cota da API excedida',
      methodNotAllowed: 'Método não permitido',
      unsupportedMediaType: 'Tipo de mídia não suportado',
      payloadTooLarge: 'Carga útil muito grande',
      requestEntityTooLarge: 'Entidade da requisição muito grande',
      contentTypeRequired: 'Cabeçalho Content-Type necessário',
      jsonParseError: 'Formato JSON inválido',
      missingRequiredField: 'Campo obrigatório ausente: {{field}}',
      invalidFieldValue: 'Valor inválido para o campo: {{field}}',
      duplicateEntry: 'Entrada duplicada encontrada',
      constraintViolation: 'Violação de restrição do banco de dados',
      connectionError: 'Erro de conexão com o banco de dados',
      checkApiDocsAction: 'Verifique a URL ou consulte a documentação da API para endpoints válidos.'
    },
    validation: {
      required: '{{field}} é obrigatório',
      email: 'Por favor, insira um endereço de email válido',
      minLength: '{{field}} deve ter pelo menos {{min}} caracteres',
      maxLength: '{{field}} não deve exceder {{max}} caracteres',
      passwordStrength: 'A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um número',
      passwordMatch: 'As senhas não coincidem',
      invalidFormat: 'Formato inválido para {{field}}',
      invalidDate: 'Formato de data inválido',
      futureDateRequired: 'A data deve estar no futuro',
      pastDateRequired: 'A data deve estar no passado',
      invalidPhone: 'Formato de número de telefone inválido',
      invalidUrl: 'Formato de URL inválido',
      numericOnly: '{{field}} deve conter apenas números',
      alphabeticOnly: '{{field}} deve conter apenas letras',
      alphanumericOnly: '{{field}} deve conter apenas letras e números',
      invalidRange: '{{field}} deve estar entre {{min}} e {{max}}',
      fileRequired: 'Arquivo é obrigatório',
      invalidFileType: 'Tipo de arquivo inválido. Tipos permitidos: {{types}}',
      fileSizeExceeded: 'O tamanho do arquivo não deve exceder {{maxSize}}',
      invalidImageFormat: 'Formato de imagem inválido',
      duplicateValue: '{{field}} já existe'
    },
    email: {
      subject: {
        welcome: 'Bem-vindo ao {{appName}}',
        passwordReset: 'Solicitação de Redefinição de Senha',
        emailVerification: 'Verifique Seu Endereço de Email',
        accountLocked: 'Alerta de Segurança da Conta',
        loginAlert: 'Novo Login Detectado'
      },
      greeting: 'Olá {{name}},',
      welcomeMessage: 'Bem-vindo ao {{appName}}! Estamos empolgados em tê-lo conosco.',
      passwordResetMessage: 'Você solicitou uma redefinição de senha. Clique no link abaixo para continuar:',
      verificationMessage: 'Por favor, verifique seu endereço de email clicando no link abaixo:',
      accountLockedMessage: 'Sua conta foi temporariamente bloqueada devido a várias tentativas de login mal-sucedidas.',
      loginAlertMessage: 'Detectamos um novo login na sua conta de {{location}} às {{time}}.',
      footer: 'Se você não solicitou isso, ignore este email ou entre em contato com o suporte.',
      buttonText: {
        resetPassword: 'Redefinir Senha',
        verifyEmail: 'Verificar Email',
        contactSupport: 'Entrar em Contato com o Suporte'
      },
      expiryNotice: 'Este link expirará em {{hours}} horas.',
      supportContact: 'Se você precisar de ajuda, entre em contato conosco em {{email}}'
    },
    business: {
      menu: {
        itemCreated: 'Item do cardápio criado com sucesso',
        itemUpdated: 'Item do cardápio atualizado com sucesso',
        itemDeleted: 'Item do cardápio excluído com sucesso',
        itemNotFound: 'Item do cardápio não encontrado',
        categoryCreated: 'Categoria do cardápio criada com sucesso',
        categoryUpdated: 'Categoria do cardápio atualizada com sucesso',
        categoryDeleted: 'Categoria do cardápio excluída com sucesso',
        categoryNotFound: 'Categoria do cardápio não encontrada',
        itemOutOfStock: 'Item do cardápio em falta',
        invalidPrice: 'Preço inválido especificado',
        duplicateItem: 'O item do cardápio já existe'
      },
      orders: {
        orderCreated: 'Pedido criado com sucesso',
        orderUpdated: 'Pedido atualizado com sucesso',
        orderCancelled: 'Pedido cancelado com sucesso',
        orderNotFound: 'Pedido não encontrado',
        orderStatusUpdated: 'Status do pedido atualizado com sucesso',
        invalidOrderStatus: 'Status do pedido inválido',
        orderAlreadyCancelled: 'O pedido já foi cancelado',
        orderCannotBeCancelled: 'O pedido não pode ser cancelado nesta fase',
        paymentRequired: 'Pagamento é necessário para completar o pedido',
        insufficientInventory: 'Inventário insuficiente para alguns itens',
        orderTotal: 'Total do pedido: {{amount}}',
        estimatedDelivery: 'Tempo de entrega estimado: {{time}} minutos'
      },
      reservations: {
        reservationCreated: 'Reserva criada com sucesso',
        reservationUpdated: 'Reserva atualizada com sucesso',
        reservationCancelled: 'Reserva cancelada com sucesso',
        reservationNotFound: 'Reserva não encontrada',
        reservationConfirmed: 'Reserva confirmada',
        tableNotAvailable: 'A mesa não está disponível no horário solicitado',
        invalidReservationTime: 'Horário de reserva inválido',
        reservationTooEarly: 'O horário de reserva está muito longe no futuro',
        reservationTooLate: 'O horário de reserva já passou',
        capacityExceeded: 'O tamanho do grupo excede a capacidade da mesa'
      }
    },
    home: {
      hero: {
        badge: 'Novo: Lançamento de recompensas — ganhe pontos em cada pedido',
        title: 'Mexicano autêntico. <primary>Entregue rapidamente.</primary>',
        desc: 'De tacos estilo rua a especialidades cozidas lentamente. Faça pedidos em segundos, reserve uma mesa instantaneamente e rastreie sua entrega em tempo real — tudo em um lugar.',
        orderNow: 'Fazer Pedido Agora',
        reserve: 'Reservar Mesa',
        browseMenu: 'Ver Cardápio',
        rating: '4.9/5 de mais de 2,400 locais',
        avgTime: '25-35 min média',
        imageAlt: 'Prato colorido de tacos com ingredientes frescos e salsa vibrante',
        card: {
          title: 'Fresco Diário',
          desc: 'Nós nos abastecemos de ingredientes dos mercados locais todas as manhãs'
        }
      },
      explore: {
        heading: 'Explore Nosso Cardápio',
        tacos: 'Tacos',
        bowls: 'Bowls',
        drinks: 'Bebidas',
        coming: 'Em Breve',
        viewMore: 'Ver Cardápio Completo',
        tabs: {
          tacos: 'Tacos',
          bowls: 'Bowls',
          drinks: 'Bebidas'
        }
      },
      loyalty: {
        heading: 'Fidelidade e Recompensas',
        membersSave: 'Membros economizam 10%',
        points: '1,250 pontos',
        nextAt: 'Próxima recompensa em {{points}}',
        freeDessert: 'Sobremesa grátis no seu aniversário',
        join: 'Participar Agora',
        perks: 'Ver Benefícios'
      },
      why: {
        heading: 'Por Que Escolher Cantina Mariachi',
        faster: {
          title: 'Mais rápido que aplicativos de entrega',
          desc: 'Diretamente da nossa cozinha para sua porta em 25-35 minutos'
        },
        fees: {
          title: 'Nenhuma taxa oculta',
          desc: 'Preços transparentes sem surpresas'
        },
        oneTap: {
          title: 'Refazer pedido com um toque',
          desc: 'Refaça seus favoritos com apenas um toque'
        },
        tracking: {
          title: 'Rastreamento ao vivo',
          desc: 'Veja exatamente quando sua comida chegará'
        },
        chef: {
          title: 'Qualidade de chef',
          desc: 'Cada prato preparado por nossos chefs especialistas'
        },
        rewards: {
          title: 'Ganhe recompensas',
          desc: 'Obtenha pontos em cada pedido e desbloqueie benefícios exclusivos'
        }
      },
      values: {
        heading: 'Nossos Valores e Abastecimento',
        desc: 'Estamos comprometidos com qualidade, sustentabilidade e apoio às comunidades locais através de abastecimento responsável e práticas ecológicas.',
        badges: {
          localProduce: 'Produtos Locais',
          sustainableSeafood: 'Frutos do Mar Sustentáveis',
          fairTrade: 'Comércio Justo',
          lowWaste: 'Baixo Desperdício'
        },
        cards: {
          dailyMarket: 'Fresco do Mercado Diário',
          houseSalsas: 'Salsas Caseiras',
          localTortillas: 'Tortillas Locais',
          compostablePackaging: 'Embalagem Compostável'
        }
      },
      value: {
        reorderDesc: 'Refaça seus favoritos em segundos',
        trustedTitle: 'Confiado por mais de 10,000 locais',
        trustedDesc: 'Junte-se a milhares de clientes satisfeitos'
      },
      how: {
        heading: 'Como Funciona',
        desc: 'Fazer pedidos com Cantina Mariachi é simples e rápido',
        step1: {
          title: 'Escolha Seus Favoritos',
          desc: 'Navegue pelo nosso cardápio e selecione seus pratos favoritos'
        },
        step2: {
          title: 'Faça Seu Pedido',
          desc: 'Personalize seu pedido e pague com segurança'
        },
        step3: {
          title: 'Rastreie e Aproveite',
          desc: 'Acompanhe seu pedido em tempo real e aproveite comida fresca'
        }
      },
      testimonials: {
        heading: 'O Que Nossos Clientes Dizem'
      },
      popular: {
        heading: 'Popular Esta Semana',
        seeMenu: 'Ver Cardápio Completo',
        coming: 'Em Breve',
        chefSpecial: 'Especial do Chef {{num}}',
        notify: 'Me Notifique',
        rating: '4.9/5 de mais de 2,400 locais'
      },
      faq: {
        heading: 'Perguntas Frequentes',
        q1: {
          question: 'Qual é o tempo de entrega?',
          answer: 'Nosso tempo médio de entrega é de 25-35 minutos. Usamos rastreamento em tempo real para você ver exatamente quando seu pedido chegará.'
        },
        q2: {
          question: 'Vocês oferecem opções vegetarianas e veganas?',
          answer: 'Sim! Temos uma ampla seleção de pratos vegetarianos e veganos. Nosso cardápio inclui tacos, bowls e acompanhamentos à base de plantas.'
        },
        q3: {
          question: 'Posso personalizar meu pedido?',
          answer: 'Absolutamente! Você pode personalizar qualquer prato adicionando ou removendo ingredientes. Apenas nos informe suas preferências ao fazer o pedido.'
        }
      },
      cta: {
        endsTonight: '⚡ Termina Esta Noite',
        title: 'Tempo Limitado: Pacote Taco Tuesday',
        desc: '2 tacos + bebida por apenas R$ 9,99. Perfeito para compartilhar ou manter tudo para você.',
        socialProof: '🔥 Mais de 2,400 pedidos esta semana',
        limited: 'Oferta por Tempo Limitado',
        start: 'Começar a Fazer Pedidos',
        reserve: 'Reservar Mesa'
      },
      sticky: {
        order: 'Fazer Pedido Agora',
        reserve: 'Reservar'
      },
      logo: {
        heading: 'Confiado por empresas locais e amantes da comida'
      },
      offers: {
        heading: 'Ofertas Sazonais',
        badge: 'Tempo limitado',
        bundle: 'Pacote Taco Tuesday',
        deal: '2 tacos + bebida — R$ 9,99',
        endsIn: 'Termina em',
        orderBundle: 'Pedir pacote',
        viewDetails: 'Ver detalhes',
        coming: 'Novas ofertas estão chegando em breve.',
        freeDelivery: 'Só hoje: entrega grátis em pedidos acima de R$ 25'
      },
      events: {
        heading: 'Eventos e Catering',
        desc: 'Organizamos eventos especiais e serviços de catering para grandes grupos. De aniversários a eventos corporativos.',
        plan: 'Planejar Evento',
        catering: 'Serviço de Catering',
        q1: {
          question: 'Qual é o tamanho mínimo do grupo para eventos?',
          answer: 'Nosso tamanho mínimo de grupo para eventos é de 20 pessoas. Para grupos menores, recomendamos reservas regulares.'
        },
        q2: {
          question: 'Vocês oferecem opções vegetarianas e veganas?',
          answer: 'Sim, temos um cardápio completo de opções vegetarianas e veganas. Também podemos personalizar cardápios de acordo com suas necessidades dietéticas.'
        }
      }
    }
  },
  
  // Arabic translations
  ar: {
    common: {
      success: 'نجح',
      error: 'خطأ',
      statusSuccess: 'نجح',
      statusError: 'خطأ',
      welcome: 'مرحباً',
      loading: 'جاري التحميل...',
      notFound: 'غير موجود',
      unauthorized: 'وصول غير مصرح',
      forbidden: 'الوصول ممنوع',
      internalError: 'خطأ داخلي في الخادم',
      badRequest: 'طلب سيء',
      created: 'تم الإنشاء بنجاح',
      updated: 'تم التحديث بنجاح',
      deleted: 'تم الحذف بنجاح',
      operationFailed: 'فشلت العملية',
      invalidRequest: 'طلب غير صالح',
      resourceNotFound: 'المورد غير موجود',
      serverError: 'خطأ في الخادم',
      maintenance: 'الخادم في الصيانة',
      rateLimited: 'طلبات كثيرة جداً. يرجى المحاولة لاحقاً.',
      timeout: 'انتهت مهلة الطلب',
      dataRetrieved: 'تم استرجاع البيانات بنجاح',
      languageUpdated: 'تم تحديث اللغة بنجاح',
      languageReset: 'تم إعادة تعيين اللغة إلى القيمة الافتراضية بنجاح'
    },
    ui: {
      brand: 'كانتينا مارياتشي',
      nav: {
        home: 'الرئيسية',
        menu: 'القائمة',
        orders: 'الطلبات',
        reservations: 'الحجوزات',
        account: 'الحساب',
        profile: 'الملف الشخصي',
        login: 'تسجيل الدخول',
        register: 'التسجيل',
        orderNow: 'اطلب الآن'
      },
      topbar: {
        open: 'مفتوح',
        closed: 'مغلق',
        eta: '{{mins}} دقيقة',
        noSignup: 'لا يلزم التسجيل',
        browse: 'تصفح القائمة'
      },
      a11y: {
        toggleLanguage: 'تبديل اللغة'
      },
      footer: {
        tagline: 'نكهات مكسيكية أصيلة، تجربة حديثة.',
        quickLinks: 'روابط سريعة',
        contact: 'اتصل بنا',
        newsletter: 'احصل على خصم 20% على طلبك الأول + عروض حصرية 📧',
        emailPlaceholder: 'عنوان البريد الإلكتروني',
        join: 'انضم',
        privacy: 'الخصوصية',
        terms: 'الشروط',
        copyright: '© {{year}} {{brand}}. جميع الحقوق محفوظة.'
      }
    },
    events: {
      heading: 'الفعاليات والضيافة',
      desc: 'ننظم فعاليات خاصة وخدمات ضيافة للمجموعات الكبيرة. من أعياد الميلاد إلى الفعاليات المؤسسية.',
      plan: 'خطط الفعالية',
      catering: 'خدمة الضيافة',
      q1: {
        question: 'ما هو الحد الأدنى لحجم المجموعة للفعاليات؟',
        answer: 'الحد الأدنى لحجم المجموعة للفعاليات هو 20 شخصاً. للمجموعات الأصغر، نوصي بالحجوزات العادية.'
      },
      q2: {
        question: 'هل تقدمون خيارات نباتية وخالية من اللحوم؟',
        answer: 'نعم، لدينا قائمة كاملة من الخيارات النباتية والخالية من اللحوم. يمكننا أيضاً تخصيص القوائم حسب احتياجاتك الغذائية.'
      }
    },
    navbar: {
      home: 'الرئيسية',
      menu: 'القائمة',
      orders: 'الطلبات',
      reservations: 'الحجوزات',
      account: 'الحساب',
      profile: 'الملف الشخصي',
      login: 'تسجيل الدخول',
      register: 'التسجيل',
      orderNow: 'اطلب الآن',
      toggleLanguage: 'تبديل اللغة',
      toggleTheme: 'تبديل المظهر',
      close: 'إغلاق'
    },
    footer: {
      tagline: 'نكهات مكسيكية أصيلة، تجربة حديثة.',
      quickLinks: 'روابط سريعة',
      contact: 'اتصل بنا',
      newsletter: 'احصل على خصم 20% على طلبك الأول + عروض حصرية 📧',
      emailPlaceholder: 'عنوان البريد الإلكتروني',
      join: 'انضم',
      privacy: 'الخصوصية',
      terms: 'الشروط',
      copyright: '© {{year}} {{brand}}. جميع الحقوق محفوظة.'
    },
    faq: {
      heading: 'الأسئلة الشائعة',
      q1: {
        question: 'ما هو وقت التوصيل؟',
        answer: 'متوسط وقت التوصيل لدينا هو 25-35 دقيقة. نستخدم التتبع في الوقت الفعلي لترى بالضبط متى سيصل طلبك.'
      },
      q2: {
        question: 'هل تقدمون خيارات نباتية وخالية من اللحوم؟',
        answer: 'نعم! لدينا مجموعة واسعة من الأطباق النباتية والخالية من اللحوم. قائمتنا تشمل تاكوس، أطباق، وجوانب نباتية.'
      },
      q3: {
        question: 'هل يمكنني تخصيص طلبي؟',
        answer: 'بالتأكيد! يمكنك تخصيص أي طبق بإضافة أو إزالة المكونات. فقط أخبرنا بتفضيلاتك عند الطلب.'
      }
    },
    popular: {
      heading: 'شائع هذا الأسبوع',
      seeMenu: 'انظر القائمة الكاملة',
      coming: 'قريباً',
      chefSpecial: 'خاص الشيف {{num}}',
      notify: 'أخبرني',
      rating: '4.9/5 من أكثر من 2,400 محلي'
    },
    auth: {
      loginSuccess: 'تم تسجيل الدخول بنجاح',
      loginFailed: 'فشل تسجيل الدخول',
      logoutSuccess: 'تم تسجيل الخروج بنجاح',
      registerSuccess: 'تم التسجيل بنجاح',
      registerFailed: 'فشل التسجيل',
      invalidCredentials: 'بيانات اعتماد غير صالحة',
      accountLocked: 'الحساب مقفل',
      accountNotVerified: 'الحساب غير مُتحقق منه',
      passwordResetSent: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني',
      passwordResetSuccess: 'تم إعادة تعيين كلمة المرور بنجاح',
      passwordResetFailed: 'فشل إعادة تعيين كلمة المرور',
      tokenExpired: 'انتهت صلاحية الرمز المميز',
      tokenInvalid: 'رمز مميز غير صالح',
      accessDenied: 'تم رفض الوصول',
      sessionExpired: 'انتهت صلاحية الجلسة',
      emailAlreadyExists: 'البريد الإلكتروني موجود بالفعل',
      usernameAlreadyExists: 'اسم المستخدم موجود بالفعل',
      accountCreated: 'تم إنشاء الحساب بنجاح',
      verificationEmailSent: 'تم إرسال بريد إلكتروني للتحقق',
      emailVerified: 'تم التحقق من البريد الإلكتروني بنجاح',
      invalidVerificationToken: 'رمز التحقق غير صالح'
    },
    api: {
      dataRetrieved: 'تم استرجاع البيانات بنجاح',
      dataUpdated: 'تم تحديث البيانات بنجاح',
      dataCreated: 'تم إنشاء البيانات بنجاح',
      dataDeleted: 'تم حذف البيانات بنجاح',
      noDataFound: 'لم يتم العثور على بيانات',
      invalidApiKey: 'مفتاح API غير صالح',
      apiKeyExpired: 'انتهت صلاحية مفتاح API',
      apiKeyRequired: 'مفتاح API مطلوب',
      quotaExceeded: 'تم تجاوز حصة API',
      methodNotAllowed: 'الطريقة غير مسموح بها',
      unsupportedMediaType: 'نوع الوسائط غير مدعوم',
      payloadTooLarge: 'الحمولة كبيرة جداً',
      requestEntityTooLarge: 'كيان الطلب كبير جداً',
      contentTypeRequired: 'رأس Content-Type مطلوب',
      jsonParseError: 'تنسيق JSON غير صالح',
      missingRequiredField: 'الحقل المطلوب مفقود: {{field}}',
      invalidFieldValue: 'قيمة غير صالحة للحقل: {{field}}',
      duplicateEntry: 'تم العثور على إدخال مكرر',
      constraintViolation: 'انتهاك قيود قاعدة البيانات',
      connectionError: 'خطأ في الاتصال بقاعدة البيانات',
      checkApiDocsAction: 'تحقق من URL أو راجع وثائق API للنقاط النهائية الصالحة.'
    },
    validation: {
      required: '{{field}} مطلوب',
      email: 'يرجى إدخال عنوان بريد إلكتروني صالح',
      minLength: '{{field}} يجب أن يحتوي على الأقل {{min}} أحرف',
      maxLength: '{{field}} يجب ألا يتجاوز {{max}} حرف',
      passwordStrength: 'كلمة المرور يجب أن تحتوي على الأقل 8 أحرف، حرف كبير واحد، حرف صغير واحد، ورقم واحد',
      passwordMatch: 'كلمات المرور لا تتطابق',
      invalidFormat: 'تنسيق غير صالح لـ {{field}}',
      invalidDate: 'تنسيق تاريخ غير صالح',
      futureDateRequired: 'التاريخ يجب أن يكون في المستقبل',
      pastDateRequired: 'التاريخ يجب أن يكون في الماضي',
      invalidPhone: 'تنسيق رقم الهاتف غير صالح',
      invalidUrl: 'تنسيق URL غير صالح',
      numericOnly: '{{field}} يجب أن يحتوي على أرقام فقط',
      alphabeticOnly: '{{field}} يجب أن يحتوي على أحرف فقط',
      alphanumericOnly: '{{field}} يجب أن يحتوي على أحرف وأرقام فقط',
      invalidRange: '{{field}} يجب أن يكون بين {{min}} و {{max}}',
      fileRequired: 'الملف مطلوب',
      invalidFileType: 'نوع ملف غير صالح. الأنواع المسموحة: {{types}}',
      fileSizeExceeded: 'حجم الملف يجب ألا يتجاوز {{maxSize}}',
      invalidImageFormat: 'تنسيق صورة غير صالح',
      duplicateValue: '{{field}} موجود بالفعل'
    },
    email: {
      subject: {
        welcome: 'مرحباً بك في {{appName}}',
        passwordReset: 'طلب إعادة تعيين كلمة المرور',
        emailVerification: 'تحقق من عنوان بريدك الإلكتروني',
        accountLocked: 'تنبيه أمان الحساب',
        loginAlert: 'تم اكتشاف تسجيل دخول جديد'
      },
      greeting: 'مرحباً {{name}}،',
      welcomeMessage: 'مرحباً بك في {{appName}}! نحن متحمسون لوجودك معنا.',
      passwordResetMessage: 'لقد طلبت إعادة تعيين كلمة المرور. انقر على الرابط أدناه للمتابعة:',
      verificationMessage: 'يرجى التحقق من عنوان بريدك الإلكتروني بالنقر على الرابط أدناه:',
      accountLockedMessage: 'تم قفل حسابك مؤقتاً بسبب عدة محاولات فاشلة لتسجيل الدخول.',
      loginAlertMessage: 'لقد اكتشفنا تسجيل دخول جديد لحسابك من {{location}} في {{time}}.',
      footer: 'إذا لم تطلب هذا، يرجى تجاهل هذا البريد الإلكتروني أو الاتصال بالدعم.',
      buttonText: {
        resetPassword: 'إعادة تعيين كلمة المرور',
        verifyEmail: 'تحقق من البريد الإلكتروني',
        contactSupport: 'اتصل بالدعم'
      },
      expiryNotice: 'هذا الرابط سينتهي في {{hours}} ساعة.',
      supportContact: 'إذا كنت بحاجة إلى مساعدة، يرجى الاتصال بنا على {{email}}'
    },
    business: {
      menu: {
        itemCreated: 'تم إنشاء عنصر القائمة بنجاح',
        itemUpdated: 'تم تحديث عنصر القائمة بنجاح',
        itemDeleted: 'تم حذف عنصر القائمة بنجاح',
        itemNotFound: 'عنصر القائمة غير موجود',
        categoryCreated: 'تم إنشاء فئة القائمة بنجاح',
        categoryUpdated: 'تم تحديث فئة القائمة بنجاح',
        categoryDeleted: 'تم حذف فئة القائمة بنجاح',
        categoryNotFound: 'فئة القائمة غير موجودة',
        itemOutOfStock: 'عنصر القائمة نفد من المخزون',
        invalidPrice: 'سعر غير صالح محدد',
        duplicateItem: 'عنصر القائمة موجود بالفعل'
      },
      orders: {
        orderCreated: 'تم إنشاء الطلب بنجاح',
        orderUpdated: 'تم تحديث الطلب بنجاح',
        orderCancelled: 'تم إلغاء الطلب بنجاح',
        orderNotFound: 'الطلب غير موجود',
        orderStatusUpdated: 'تم تحديث حالة الطلب بنجاح',
        invalidOrderStatus: 'حالة الطلب غير صالحة',
        orderAlreadyCancelled: 'الطلب مُلغى بالفعل',
        orderCannotBeCancelled: 'الطلب لا يمكن إلغاؤه في هذه المرحلة',
        paymentRequired: 'الدفع مطلوب لإكمال الطلب',
        insufficientInventory: 'مخزون غير كافٍ لبعض العناصر',
        orderTotal: 'إجمالي الطلب: {{amount}}',
        estimatedDelivery: 'وقت التوصيل المقدر: {{time}} دقيقة'
      },
      reservations: {
        reservationCreated: 'تم إنشاء الحجز بنجاح',
        reservationUpdated: 'تم تحديث الحجز بنجاح',
        reservationCancelled: 'تم إلغاء الحجز بنجاح',
        reservationNotFound: 'الحجز غير موجود',
        reservationConfirmed: 'تم تأكيد الحجز',
        tableNotAvailable: 'الطاولة غير متاحة في الوقت المطلوب',
        invalidReservationTime: 'وقت الحجز غير صالح',
        reservationTooEarly: 'وقت الحجز مبكر جداً في المستقبل',
        reservationTooLate: 'وقت الحجز متأخر جداً',
        capacityExceeded: 'حجم المجموعة يتجاوز سعة الطاولة'
      }
    },
    home: {
      hero: {
        badge: 'جديد: إطلاق المكافآت — اربح نقاط على كل طلب',
        title: 'مكسيكي أصيل. <primary>يُسلم بسرعة.</primary>',
        desc: 'من التاكوس بأسلوب الشارع إلى التخصصات المطبوخة ببطء. اطلب في ثوانٍ، احجز طاولة فوراً وتتبع توصيلك في الوقت الفعلي — كل شيء في مكان واحد.',
        orderNow: 'اطلب الآن',
        reserve: 'احجز طاولة',
        browseMenu: 'تصفح القائمة',
        rating: '4.9/5 من أكثر من 2,400 محلي',
        avgTime: '25-35 دقيقة متوسط',
        imageAlt: 'طبق ملون من التاكوس مع مكونات طازجة وصلصة نابضة بالحياة',
        card: {
          title: 'طازج يومياً',
          desc: 'نحن نتزود بالمكونات من الأسواق المحلية كل صباح'
        }
      },
      explore: {
        heading: 'استكشف قائمتنا',
        tacos: 'تاكوس',
        bowls: 'أطباق',
        drinks: 'مشروبات',
        coming: 'قريباً',
        viewMore: 'انظر القائمة الكاملة',
        tabs: {
          tacos: 'تاكوس',
          bowls: 'أطباق',
          drinks: 'مشروبات'
        }
      },
      loyalty: {
        heading: 'الولاء والمكافآت',
        membersSave: 'الأعضاء يوفرون 10%',
        points: '1,250 نقطة',
        nextAt: 'المكافأة التالية عند {{points}}',
        freeDessert: 'حلوى مجانية في عيد ميلادك',
        join: 'انضم الآن',
        perks: 'انظر المزايا'
      },
      why: {
        heading: 'لماذا تختار كانتينا مارياتشي',
        faster: {
          title: 'أسرع من تطبيقات التوصيل',
          desc: 'مباشرة من مطبخنا إلى بابك في 25-35 دقيقة'
        },
        fees: {
          title: 'لا توجد رسوم خفية',
          desc: 'أسعار شفافة بدون مفاجآت'
        },
        oneTap: {
          title: 'إعادة طلب بنقرة واحدة',
          desc: 'أعد طلب مفضلاتك بنقرة واحدة فقط'
        },
        tracking: {
          title: 'تتبع مباشر',
          desc: 'انظر بالضبط متى سيصل طعامك'
        },
        chef: {
          title: 'جودة الشيف',
          desc: 'كل طبق مُعد من قبل شيفاتنا الخبراء'
        },
        rewards: {
          title: 'اربح مكافآت',
          desc: 'احصل على نقاط على كل طلب وافتح مزايا حصرية'
        }
      },
      values: {
        heading: 'قيمنا والتوريد',
        desc: 'نحن ملتزمون بالجودة والاستدامة ودعم المجتمعات المحلية من خلال التوريد المسؤول والممارسات الصديقة للبيئة.',
        badges: {
          localProduce: 'منتجات محلية',
          sustainableSeafood: 'مأكولات بحرية مستدامة',
          fairTrade: 'تجارة عادلة',
          lowWaste: 'نفايات منخفضة'
        },
        cards: {
          dailyMarket: 'طازج من السوق اليومي',
          houseSalsas: 'صلصات منزلية',
          localTortillas: 'تورتياس محلية',
          compostablePackaging: 'تغليف قابل للتحلل'
        }
      },
      value: {
        reorderDesc: 'أعد طلب مفضلاتك في ثوانٍ',
        trustedTitle: 'موثوق من أكثر من 10,000 محلي',
        trustedDesc: 'انضم إلى آلاف العملاء الراضين'
      },
      how: {
        heading: 'كيف يعمل',
        desc: 'الطلب مع كانتينا مارياتشي بسيط وسريع',
        step1: {
          title: 'اختر مفضلاتك',
          desc: 'تصفح قائمتنا واختر أطباقك المفضلة'
        },
        step2: {
          title: 'ضع طلبك',
          desc: 'خصص طلبك وادفع بأمان'
        },
        step3: {
          title: 'تتبع واستمتع',
          desc: 'اتبع طلبك في الوقت الفعلي واستمتع بطعام طازج'
        }
      },
      testimonials: {
        heading: 'ماذا يقول عملاؤنا'
      },
      popular: {
        heading: 'شائع هذا الأسبوع',
        seeMenu: 'انظر القائمة الكاملة',
        coming: 'قريباً',
        chefSpecial: 'خاص الشيف {{num}}',
        notify: 'أخبرني',
        rating: '4.9/5 من أكثر من 2,400 محلي'
      },
      faq: {
        heading: 'الأسئلة الشائعة',
        q1: {
          question: 'ما هو وقت التوصيل؟',
          answer: 'متوسط وقت التوصيل لدينا هو 25-35 دقيقة. نستخدم التتبع في الوقت الفعلي لترى بالضبط متى سيصل طلبك.'
        },
        q2: {
          question: 'هل تقدمون خيارات نباتية وخالية من اللحوم؟',
          answer: 'نعم! لدينا مجموعة واسعة من الأطباق النباتية والخالية من اللحوم. قائمتنا تشمل تاكوس، أطباق، وجوانب نباتية.'
        },
        q3: {
          question: 'هل يمكنني تخصيص طلبي؟',
          answer: 'بالتأكيد! يمكنك تخصيص أي طبق بإضافة أو إزالة المكونات. فقط أخبرنا بتفضيلاتك عند الطلب.'
        }
      },
      cta: {
        endsTonight: '⚡ ينتهي الليلة',
        title: 'وقت محدود: حزمة تاكو الثلاثاء',
        desc: '2 تاكو + مشروب مقابل 9.99$ فقط. مثالي للمشاركة أو الاحتفاظ بكل شيء لنفسك.',
        socialProof: '🔥 أكثر من 2,400 طلب هذا الأسبوع',
        limited: 'عرض محدود الوقت',
        start: 'ابدأ الطلب',
        reserve: 'احجز طاولة'
      },
      sticky: {
        order: 'اطلب الآن',
        reserve: 'احجز'
      },
      logo: {
        heading: 'موثوق من الشركات المحلية وعشاق الطعام'
      },
      offers: {
        heading: 'عروض موسمية',
        badge: 'وقت محدود',
        bundle: 'حزمة تاكو الثلاثاء',
        deal: '2 تاكو + مشروب — 9.99$',
        endsIn: 'ينتهي في',
        orderBundle: 'اطلب الحزمة',
        viewDetails: 'انظر التفاصيل',
        coming: 'عروض جديدة قادمة قريباً.',
        freeDelivery: 'اليوم فقط: توصيل مجاني للطلبات فوق 25$'
      },
      events: {
        heading: 'الفعاليات والضيافة',
        desc: 'ننظم فعاليات خاصة وخدمات ضيافة للمجموعات الكبيرة. من أعياد الميلاد إلى الفعاليات المؤسسية.',
        plan: 'خطط الفعالية',
        catering: 'خدمة الضيافة',
        q1: {
          question: 'ما هو الحد الأدنى لحجم المجموعة للفعاليات؟',
          answer: 'الحد الأدنى لحجم المجموعة للفعاليات هو 20 شخصاً. للمجموعات الأصغر، نوصي بالحجوزات العادية.'
        },
        q2: {
          question: 'هل تقدمون خيارات نباتية وخالية من اللحوم؟',
          answer: 'نعم، لدينا قائمة كاملة من الخيارات النباتية والخالية من اللحوم. يمكننا أيضاً تخصيص القوائم حسب احتياجاتك الغذائية.'
        }
      }
    }
  }
};