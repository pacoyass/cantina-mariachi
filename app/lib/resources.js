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
        duplicateItem: 'El elemento del menú ya existe'
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
        insufficientInventory: 'Inventario insuficiente para algunos elementos',
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
        order: 'Ordenar Ahora',
        reserve: 'Reservar'
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
  }
};