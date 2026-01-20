import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// i18n.js
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        // HeaderBar
        profile: 'Profile',
        help: 'Help',
        lightMode: 'Light Mode',
        darkMode: 'Dark Mode',
        theme: 'Theme',
        signOut: 'Sign Out',

        // LandingPage
        hero: {
          title: 'Plan Your Day.\nMaximize Your Impact.',
          subtitle:
            'A smart day planner that prioritizes tasks by value and time — so you always know what to do next.',
          getStarted: 'Get Started',
        },
        features: {
          title: 'Why Day Planner?',
          valueBased: {
            title: 'Value-Based Prioritization',
            description: 'Automatically focus on tasks with the highest impact per unit of time.',
          },
          flowMode: {
            title: 'Flow Mode',
            description: 'Work distraction-free by tackling one high-impact task at a time.',
          },
          recurring: {
            title: 'Recurring Tasks',
            description: 'Build habits with daily, weekly, or custom periodic tasks.',
          },
          calendar: {
            title: 'Calendar View',
            description: 'Drag, drop, and schedule tasks visually across your day.',
          },
        },
        cta: {
          title: 'Take Control of Your Day',
          subtitle: 'Stop guessing what to do next. Let value and time guide your focus.',
          startPlanning: 'Start Planning',
        },
        footer: {
          brand: 'Day Planner',
        },
        flowMode: {
          title: 'Flow Mode',
          subtitle: 'Highest value / time task, one at a time',
          now: 'Now',
          next: 'Next',
          score: 'Score',
          tasks: {
            proposal: 'Write project proposal',
            agenda: 'Prepare meeting agenda',
            notes: 'Review notes',
          },
        },

        // SignIn page
        signIn: 'Sign In',
        signInWithGoogle: 'Sign in with Google',
        continueAsGuest: 'Continue as Guest',
        or: 'or',
        emailAddress: 'Email Address',
        password: 'Password',
        capsLockOn: 'Caps Lock is ON',
        forgotPassword: 'Forgot password?',
        dontHaveAccount: "Don't have an account? Sign Up",
        loading: 'Loading...',

        // SignUp page
        signUp: 'Sign Up',
        alreadyLoggedIn: 'You are already logged in',
        passwordStrength: 'Password Strength',
        signUpButton: 'Sign Up',
        alreadyHaveAccount: 'Already have an account? Sign In',

        // Password Strength
        veryWeak: 'Very Weak',
        weak: 'Weak',
        moderate: 'Moderate',
        strong: 'Strong',
        veryStrong: 'Very Strong',
        veryWeakHint: 'Try adding uppercase letters, numbers, and symbols.',
        weakHint: 'Include more character types for better security.',
        moderateHint: 'Good start! Add symbols or longer length.',
        strongHint: 'Strong password. Consider making it even longer.',
        veryStrongHint: 'Excellent! Your password is very secure.',

        // ForgotPassword page
        forgotPasswordPage: 'Forgot Password',
        emailSent: 'E-mail sent.',
        resetPassword: 'Reset Password',
        signInLink: 'Sign In',

        // Profile page
        profileSettings: 'Profile Settings',
        changePassword: 'Change Password',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        updatePassword: 'Update Password',
        upgradeGuest: 'Upgrade your guest account to a permanent account:',
        upgradeAccount: 'Upgrade Account',
        upgradeWithGoogle: 'Upgrade with Google',
        noUserSignedIn: 'No user is signed in.',
        passwordUpdated: 'Password updated successfully!',
        accountUpgraded: 'Account upgraded successfully! You now have a permanent account.',
        accountUpgradedGoogle: 'Account upgraded successfully with Google!',

        // Errors
        'auth/user-not-found': 'No user found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/email-already-in-use': 'This email is already in use.',
        'auth/weak-password': 'Password is too weak.',

        // NotFound page
        notFoundTitle: '404 – Page Not Found',
        notFoundMessage: 'Oops! The page you’re looking for doesn’t exist.',
        goHome: 'Go Home',

        // TodoList
        todoList: {
          columns: {
            name: 'To-Do',
            score: 'Score',
            value: 'Value',
            time: 'Time',
          },
          empty: {
            title: 'No to-do items yet',
            subtitle: 'Click "Add To-Do" to create your first task.',
          },
        },
        actions: 'Actions',
        addToCalendar: 'Add to calendar',
        description: 'Description',
        common: {
          cancel: 'Cancel',
          add: 'Add',
          save: 'Save',
          edit: 'Edit',
          delete: 'Delete',
        },
        todoDialog: {
          addTitle: 'Add a new To-Do',
          editTitle: 'Edit To-Do',
          fields: {
            title: 'Title',
            value: 'Value',
            time: 'Time (minutes)',
          },
        },
        addTodo: 'Add To-Do',
        confirmDelete: {
          title: 'Confirm Deletion',
          message: 'Are you sure you want to delete this to-do item?',
        },

        // PeriodicTodoList
        periodicList: {
          columns: {
            todo: 'To-Do',
            period: 'Period',
          },
          empty: {
            title: 'No periodic tasks yet',
            subtitle: 'Click "Add Periodic" to create a recurring to-do.',
          },
        },
        days: {
          monday: 'Monday',
          tuesday: 'Tuesday',
          wednesday: 'Wednesday',
          thursday: 'Thursday',
          friday: 'Friday',
          saturday: 'Saturday',
          sunday: 'Sunday',
          weekends: 'Weekend',
          weekdays: 'Weekday',
          mondayAbr: 'Mo',
          tuesdayAbr: 'Tu',
          wednesdayAbr: 'We',
          thursdayAbr: 'Th',
          fridayAbr: 'Fr',
          saturdayAbr: 'Sa',
          sundayAbr: 'Su',
        },
        periodicChip: {
          daily: 'Daily',
          every: 'Every {{label}}',
        },
        periodicDialog: {
          addTitle: 'Add Periodic To-Do',
          editTitle: 'Edit Periodic To-Do',
          fields: {
            title: 'Title',
            period: 'Period',
          },
          helper: 'Select one or more days for this periodic task',
        },
        addPeriodic: 'Add Periodic',
        confirmDeletePeriodic: {
          title: 'Confirm Deletion',
          message: 'Are you sure you want to delete this periodic to-do item?',
        },

        // Description dialog
        descriptionDialog: {
          title: 'Edit Description',
          placeholder: 'Write details about this to-do...',
        },

        // Calendar
        calendar: {
          dayView: 'Day View',
          open: 'Open',
          delete: 'Delete',
          deleteRecurring: 'Delete Recurring',
          details: 'Details',
          save: 'Save',
          cancel: 'Cancel',
          title: 'Title',
          startDate: 'Start Date',
          endDate: 'End Date',
        },

        // Taskflow
        taskFlow: {
          noTasks: 'No tasks in flow',
          nextTaskIn: 'Next task in:',
        },
        currentTask: {
          title: 'Current Task',
          fields: {
            score: 'Score',
            scheduleLater: 'Schedule later (minutes)',
          },
          actions: {
            queue: 'Queue',
            remove: 'Remove',
          },
        },

        // App
        dayPlanner: {
          startFlow: 'Start Flow',
          stopFlow: 'Stop Flow',
          tabs: {
            calendar: 'Calendar',
            todo: 'To-Do',
            periodic: 'Periodic',
          },
        },
      },
    },
    tr: {
      translation: {
        // HeaderBar
        profile: 'Profil',
        help: 'Yardım',
        lightMode: 'Açık Mod',
        darkMode: 'Koyu Mod',
        theme: 'Tema',
        signOut: 'Çıkış',

        // LandingPage
        hero: {
          title: 'Gününü Planla.\nEtkini Maksimize Et.',
          subtitle:
            'Değer ve zamana göre önceliklendiren akıllı bir gün planlayıcı — her an yapman gerekeni bilirsin.',
          getStarted: 'Başla',
        },
        features: {
          title: 'Neden Day Planner?',
          valueBased: {
            title: 'Değer Bazlı Önceliklendirme',
            description: 'En kısa zamanda en yüksek değere sahip görevlere otomatikman odaklan.',
          },
          flowMode: {
            title: 'Akış Modu',
            description: 'Dikkat dağıtmadan, tek seferde en yüksek değerli görev üzerinde çalış.',
          },
          recurring: {
            title: 'Tekrarlayan Görevler',
            description: 'Günlük, haftalık veya özel periyodik görevlerle rutin oluştur.',
          },
          calendar: {
            title: 'Takvim Görünümü',
            description: 'Görevleri gün boyunca planla.',
          },
        },
        cta: {
          title: 'Gününün Kontrolünü Eline Al',
          subtitle:
            'Bundan sonra ne yapacağını düşünmeyi etmeyi bırak. Değer ve zamana göre odağını yönlendir.',
          startPlanning: 'Planlamaya Başla',
        },
        footer: {
          brand: 'Day Planner',
        },
        flowMode: {
          title: 'Akış Modu',
          subtitle: 'En yüksek değer / zaman görevi, teker teker yap',
          now: 'Şimdi',
          next: 'Sonraki',
          score: 'Skor',
          tasks: {
            proposal: 'Proje tasarını yaz',
            agenda: 'Toplantı gündemini hazırla',
            notes: 'Notları gözden geçir',
          },
        },

        // SignIn page
        signIn: 'Giriş Yap',
        signInWithGoogle: 'Google ile Giriş Yap',
        continueAsGuest: 'Misafir olarak devam et',
        or: 'veya',
        emailAddress: 'E-posta Adresi',
        password: 'Şifre',
        capsLockOn: 'Caps Lock AÇIK',
        forgotPassword: 'Şifreni mi unuttun?',
        dontHaveAccount: 'Hesabın yok mu? Kayıt Ol',
        loading: 'Yükleniyor...',

        // SignUp page
        signUp: 'Kayıt Ol',
        alreadyLoggedIn: 'Zaten giriş yaptınız',
        passwordStrength: 'Şifre Gücü',
        signUpButton: 'Kayıt Ol',
        alreadyHaveAccount: 'Hesabınız var mı? Giriş Yap',

        // Password Strength
        veryWeak: 'Çok Zayıf',
        weak: 'Zayıf',
        moderate: 'Orta',
        strong: 'Güçlü',
        veryStrong: 'Çok Güçlü',
        veryWeakHint: 'Büyük harfler, rakamlar ve semboller eklemeyi deneyin.',
        weakHint: 'Daha fazla karakter türü ekleyerek güvenliği artırın.',
        moderateHint: 'İyi başlangıç! Semboller ekleyin veya uzunluğu artırın.',
        strongHint: 'Güçlü şifre. Daha da uzun yapmayı düşünebilirsiniz.',
        veryStrongHint: 'Mükemmel! Şifreniz çok güvenli.',

        // ForgotPassword page
        forgotPasswordPage: 'Şifremi Unuttum',
        emailSent: 'E-posta gönderildi.',
        resetPassword: 'Şifreyi Sıfırla',
        signInLink: 'Giriş Yap',

        // Profile page
        profileSettings: 'Profil Ayarları',
        changePassword: 'Şifreyi Değiştir',
        currentPassword: 'Mevcut Şifre',
        newPassword: 'Yeni Şifre',
        updatePassword: 'Şifreyi Güncelle',
        upgradeGuest: 'Misafir hesabınızı kalıcı bir hesaba yükseltin:',
        upgradeAccount: 'Hesabı Yükselt',
        upgradeWithGoogle: 'Google ile Yükselt',
        noUserSignedIn: 'Hiçbir kullanıcı giriş yapmamış.',
        passwordUpdated: 'Şifre başarıyla güncellendi!',
        accountUpgraded: 'Hesap başarıyla yükseltildi! Artık kalıcı bir hesabınız var.',
        accountUpgradedGoogle: 'Hesap Google ile başarıyla yükseltildi!',

        // Errors
        'auth/user-not-found': 'Bu e-posta ile kullanıcı bulunamadı.',
        'auth/wrong-password': 'Şifre yanlış.',
        'auth/email-already-in-use': 'Bu e-posta zaten kullanımda.',
        'auth/weak-password': 'Şifre çok zayıf.',

        // NotFound page
        notFoundTitle: '404 – Sayfa Bulunamadı',
        notFoundMessage: 'Hata! Aradığınız sayfa mevcut değil.',
        goHome: 'Ana Sayfaya Dön',

        // TodoList
        todoList: {
          columns: {
            name: 'Görev',
            score: 'Skor',
            value: 'Değer',
            time: 'Süre',
          },
          empty: {
            title: 'Henüz yapılacak görev yok',
            subtitle: 'İlk görevinizi oluşturmak için "Görev Ekle"ye tıklayın.',
          },
        },
        actions: 'İşlemler',
        addToCalendar: 'Takvime ekle',
        description: 'Açıklama',
        common: {
          cancel: 'İptal',
          add: 'Ekle',
          save: 'Kaydet',
          edit: 'Düzenle',
          delete: 'Sil',
        },
        todoDialog: {
          addTitle: 'Yeni görev ekle',
          editTitle: 'Görev düzenle',
          fields: {
            title: 'Başlık',
            value: 'Değer',
            time: 'Süre (dakika)',
          },
        },
        addTodo: 'Görev Ekle',
        confirmDelete: {
          title: 'Silmeyi Onayla',
          message: 'Bu görev öğesini silmek istediğinizden emin misiniz?',
        },

        // PeriodicTodoList
        periodicList: {
          columns: {
            todo: 'Görev',
            period: 'Periyot',
          },
          empty: {
            title: 'Henüz periyodik görev yok',
            subtitle: 'Tekrarlayan bir görev oluşturmak için "Periyodik Ekle"ye tıklayın.',
          },
        },
        days: {
          monday: 'Pazartesi',
          tuesday: 'Salı',
          wednesday: 'Çarşamba',
          thursday: 'Perşembe',
          friday: 'Cuma',
          saturday: 'Cumartesi',
          sunday: 'Pazar',
          weekends: 'Hafta sonu',
          weekdays: 'Hafta içi',
          mondayAbr: 'Pts',
          tuesdayAbr: 'Sal',
          wednesdayAbr: 'Çar',
          thursdayAbr: 'Per',
          fridayAbr: 'Cum',
          saturdayAbr: 'Cts',
          sundayAbr: 'Paz',
        },
        periodicChip: {
          daily: 'Günlük',
          every: 'Her {{label}}',
        },
        periodicDialog: {
          addTitle: 'Periyodik Yapılacak Ekle',
          editTitle: 'Periyodik Yapılacak Düzenle',
          fields: {
            title: 'Başlık',
            period: 'Periyot',
          },
          helper: 'Bu periyodik görev için bir veya daha fazla gün seçin',
        },
        addPeriodic: 'Periyodik Ekle',
        confirmDeletePeriodic: {
          title: 'Silmeyi Onayla',
          message: 'Bu periyodik görevi silmek istediğinizden emin misiniz?',
        },

        // Description dialog
        descriptionDialog: {
          title: 'Açıklamayı Düzenle',
          placeholder: 'Bu görev hakkında ayrıntılar yazın...',
        },

        // Calendar
        calendar: {
          dayView: 'Gün Görünümü',
          open: 'Aç',
          delete: 'Sil',
          deleteRecurring: 'Tekrarlayanı Sil',
          details: 'Detaylar',
          save: 'Kaydet',
          cancel: 'İptal',
          title: 'Başlık',
          startDate: 'Başlangıç Tarihi',
          endDate: 'Bitiş Tarihi',
        },

        // Taskflow
        taskFlow: {
          noTasks: 'Akışta görev yok',
          nextTaskIn: 'Sonraki görev:',
        },
        currentTask: {
          title: 'Mevcut Görev',
          fields: {
            score: 'Skor',
            scheduleLater: 'Daha sonraya planla (dakika)',
          },
          actions: {
            queue: 'Ertele',
            remove: 'Kaldır',
          },
        },

        // App
        dayPlanner: {
          startFlow: 'Akışı Başlat',
          stopFlow: 'Akışı Durdur',
          tabs: {
            calendar: 'Takvim',
            todo: 'Görevler',
            periodic: 'Periyodik',
          },
        },
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
