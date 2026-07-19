const SUPPORTED_LANGS = ["tr", "en", "de"];
const DEFAULT_LANG = "tr";
const LANG_STORAGE_KEY = "als-lang";
const LOCALE_BY_LANG = { tr: "tr-TR", en: "en-GB", de: "de-DE" };

const translations = {
    tr: {
        nav: { home: "Ana Sayfa", parts: "Parçalar", sales: "Satışlar", customers: "Müşteriler", reports: "Raporlar", settings: "Ayarlar" },
        skip: { link: "İçeriğe geç" },
        common: {
            cancel: "İptal",
            save: "Kaydet",
            edit: "Düzenle",
            delete: "Sil",
            retry: "Tekrar dene",
            close: "Kapat",
            confirmTitle: "Emin misiniz?",
            connectError: "Sunucuya bağlanılamıyor. Backend çalışıyor mu kontrol edin.",
            deleteFailed: "Silinemedi: {{error}}",
            saveFailed: "Kaydedilemedi: {{error}}",
        },
        home: {
            docTitle: "Mertory | Atölye Yönetim Sistemi",
            title: "Ana Sayfa",
            loading: "Yükleniyor…",
            partsRowTitle: "Parçalar",
            salesRowTitle: "Satışlar",
            customersRowTitle: "Müşteriler",
            partsCount_one: "{{countFig}} parça",
            partsCount_other: "{{countFig}} parça",
            partsAttention_one: "{{countFig}} dikkat gerektiriyor",
            partsAttention_other: "{{countFig}} dikkat gerektiriyor",
            salesNone: "Bugün henüz satış yok",
            salesToday_one: "Bugün {{countFig}} satış · {{totalFig}}",
            salesToday_other: "Bugün {{countFig}} satış · {{totalFig}}",
            customersCount_one: "{{countFig}} müşteri",
            customersCount_other: "{{countFig}} müşteri",
            errorLoad: "Özet bilgiler yüklenemedi: {{error}}",
        },
        parts: {
            docTitle: "Parçalar - Mertory",
            title: "Parçalar",
            newBtn: "+ Yeni Parça",
            searchLabel: "Ara: parça adı, OE numarası, marka, araç marka/model",
            searchPlaceholder: "Ara: parça adı, OE no, marka, araç marka/model…",
            table: {
                name: "Parça Adı", oeNumber: "OE No", brand: "Marka", vehicle: "Araç",
                condition: "Durum", stock: "Stok", buyPrice: "Alış", sellPrice: "Satış",
                stockStatus: "Stok Durumu", actions: "İşlem",
            },
            empty: {
                title: "Henüz parça eklenmedi",
                body: "İlk parçanı ekleyerek stok takibine başla.",
                searchTitle: "Arama sonucu bulunamadı",
                searchBody: "\"{{term}}\" için eşleşen parça yok.",
                clearSearch: "Aramayı temizle",
                newBtn: "+ Yeni Parça",
            },
            dialog: {
                newTitle: "Yeni Parça", editTitle: "Parça Düzenle",
                name: "Parça Adı *", nameError: "Parça adı zorunlu.",
                oeNumber: "OE Numarası",
                condition: "Durum", conditionNew: "Yeni", conditionRefurbished: "Yenilenmiş",
                brand: "Marka", vehicleType: "Araç Tipi", vehicleBrand: "Araç Marka", vehicleModel: "Araç Model",
                chassisCode: "Şasi Kodu (opsiyonel)",
                isRemanufactured: "Yenilenmiş parça (kor sistemi)",
                coreCharge: "Kor Bedeli (€)",
                stock: "Stok Adedi", buyPrice: "Alış Fiyatı (€)", sellPrice: "Satış Fiyatı (€)",
            },
            vehicleType: {
                car: "Otomobil", truck: "Kamyon", motorcycle: "Motosiklet",
                bus: "Otobüs", agri: "Tarım/İş Makinesi",
            },
            filter: {
                allVehicleTypes: "Tüm Araç Tipleri",
                vehicleTypeLabel: "Araç tipine göre filtrele",
            },
            pill: { inStock: "Stokta", lowStock: "Az Stok", outOfStock: "Tükendi" },
            toast: {
                added: "Parça eklendi.", updated: "Parça güncellendi.", deleted: "Parça silindi.",
                fetchError: "Parça bilgisi alınamadı: {{error}}",
            },
            confirmDelete: "Bu parçayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
            errorLoad: "Parçalar yüklenemedi: {{error}}",
        },
        sales: {
            docTitle: "Satışlar - Mertory",
            title: "Satışlar",
            newBtn: "+ Yeni Satış",
            newBtnDisabledHint: "Önce en az bir parça ekleyin",
            table: {
                date: "Tarih", part: "Parça", customer: "Müşteri", quantity: "Adet",
                amount: "Tutar", core: "Kor", note: "Not", actions: "İşlem", deletedPart: "Silinmiş parça",
            },
            empty: {
                title: "Henüz satış kaydı yok",
                body: "İlk satışını kaydederek başla.",
                needsPart: "Satış eklemeden önce en az bir parça eklemelisin.",
                goToParts: "Parçalara Git",
                newBtn: "+ Yeni Satış",
                noPendingCoresTitle: "Bekleyen kor yok",
                noPendingCoresBody: "Tüm kor iadeleri tamamlanmış.",
            },
            dialog: {
                newTitle: "Yeni Satış",
                part: "Parça *", partError: "Parça seçimi zorunlu.",
                customer: "Müşteri (opsiyonel)", customerNone: "— Seçilmedi —",
                quantity: "Adet",
                price: "Satış Fiyatı (€) *", priceError: "Geçerli bir satış fiyatı girin.",
                note: "Not",
                stockWarning: "Yetersiz stok: elde {{stock}} adet var.",
                stockLabel: "Stok: {{stock}}",
                outOfStockSuffix: " — Tükendi",
                coreReturned: "Eski parça (kor) alındı mı?",
                totalLabel: "Toplam",
                coreChargeNote: "Kor bedeli (€{{amount}}) dahil — parça iade edilince geri ödenir.",
                coreWaivedNote: "Kor bedeli alınmadı — eski parça teslim edildi.",
            },
            pill: { corePending: "Bekliyor", coreReceived: "Alındı" },
            toolbar: { pendingCoreOnly: "Sadece bekleyen korlar" },
            action: { markCoreReturned: "Kor Alındı" },
            toast: {
                added: "Satış kaydedildi.", deleted: "Satış silindi.",
                refDataError: "Güncel veriler alınamadı: {{error}}",
                coreUpdated: "Kor durumu güncellendi.",
            },
            confirmDelete: "Bu satışı silmek istediğinizden emin misiniz? Parça stoğu geri eklenecek.",
            errorLoad: "Satışlar yüklenemedi: {{error}}",
            errorLoadAll: "Veriler yüklenemedi: {{error}}",
        },
        customers: {
            docTitle: "Müşteriler - Mertory",
            title: "Müşteriler",
            newBtn: "+ Yeni Müşteri",
            searchLabel: "Ara: isim, telefon",
            searchPlaceholder: "Ara: isim, telefon…",
            table: {
                name: "Ad Soyad", phone: "Telefon", email: "Email",
                salesCount: "Satış", totalAmount: "Toplam Tutar", actions: "İşlem",
            },
            empty: {
                title: "Henüz müşteri eklenmedi",
                body: "İlk müşterini ekleyerek başla.",
                searchTitle: "Arama sonucu bulunamadı",
                searchBody: "\"{{term}}\" için eşleşen müşteri yok.",
                clearSearch: "Aramayı temizle",
                newBtn: "+ Yeni Müşteri",
            },
            dialog: {
                newTitle: "Yeni Müşteri", editTitle: "Müşteri Düzenle",
                name: "Ad Soyad *", nameError: "Ad soyad zorunlu.",
                phone: "Telefon",
                email: "Email", emailError: "Geçerli bir email adresi girin.",
            },
            toast: {
                added: "Müşteri eklendi.", updated: "Müşteri güncellendi.", deleted: "Müşteri silindi.",
                fetchError: "Müşteri bilgisi alınamadı: {{error}}",
            },
            confirmDelete: "Bu müşteriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
            errorLoad: "Müşteriler yüklenemedi: {{error}}",
        },
        reports: {
            docTitle: "Raporlar - Mertory",
            title: "Raporlar",
            range: {
                today: "Bugün", week: "Bu Hafta", month: "Bu Ay", all: "Tüm Zamanlar", custom: "Özel",
                startLabel: "Başlangıç", endLabel: "Bitiş",
            },
            stats: {
                salesCount: "Toplam Satış", revenue: "Toplam Ciro", cost: "Toplam Maliyet",
                netProfit: "Net Kâr", pendingCores: "Bekleyen Kor",
            },
            topParts: {
                title: "En Çok Satan Parçalar",
                desc: "Seçilen aralıkta, adet bazında ilk 5",
                qty_one: "{{count}} adet",
                qty_other: "{{count}} adet",
                empty: "Bu aralıkta satış yok.",
            },
            lowStock: {
                title: "Düşük Stoklu Parçalar",
                desc: "Dikkat gerektiren parçalar",
                empty: "Dikkat gerektiren parça yok.",
            },
            errorLoad: "Rapor verileri yüklenemedi: {{error}}",
        },
        settings: {
            docTitle: "Ayarlar - Mertory",
            title: "Ayarlar",
            languageTitle: "Dil",
            languageBody: "Uygulamanın dilini seç. Seçimin bu cihazda hatırlanır.",
            lang: { trHint: "Varsayılan dil", enHint: "", deHint: "Berlin'deki çoğu müşteri için" },
            darkMode: {
                title: "Görünüm",
                label: "Karanlık Mod",
                hint: "Koyu renkli arka plan kullan. Seçimin bu cihazda hatırlanır.",
            },
            business: {
                title: "İşletme Bilgileri",
                name: "İşletme Adı",
                address: "Adres",
                phone: "Telefon",
            },
            data: {
                title: "Veri ve Yedekleme",
                body: "Tüm parça, satış ve müşteri kayıtlarını CSV dosyaları olarak indir.",
                exportBtn: "Verileri Dışa Aktar",
                exportSuccess: "Veriler dışa aktarıldı.",
                exportError: "Dışa aktarma başarısız: {{error}}",
            },
            backups: {
                title: "Yedekler",
                body: "Veritabanının yedeği. Uygulama her açıldığında günde bir kez, otomatik olarak yedek alınır.",
                lastLabel: "Son yedek:",
                none: "Henüz yedek alınmadı",
                nowBtn: "Şimdi Yedekle",
                downloadBtn: "İndir",
                empty: "Henüz yedek alınmadı.",
                success: "Yedek oluşturuldu.",
                error: "Yedekleme başarısız: {{error}}",
            },
            about: {
                title: "Hakkında",
                appName: "Mertory — Atölye Yönetim Sistemi",
                versionLabel: "Versiyon",
            },
        },
    },

    en: {
        nav: { home: "Home", parts: "Parts", sales: "Sales", customers: "Customers", reports: "Reports", settings: "Settings" },
        skip: { link: "Skip to content" },
        common: {
            cancel: "Cancel",
            save: "Save",
            edit: "Edit",
            delete: "Delete",
            retry: "Retry",
            close: "Close",
            confirmTitle: "Are you sure?",
            connectError: "Can't connect to the server. Check whether the backend is running.",
            deleteFailed: "Couldn't delete: {{error}}",
            saveFailed: "Couldn't save: {{error}}",
        },
        home: {
            docTitle: "Mertory | Workshop Management System",
            title: "Home",
            loading: "Loading…",
            partsRowTitle: "Parts",
            salesRowTitle: "Sales",
            customersRowTitle: "Customers",
            partsCount_one: "{{countFig}} part",
            partsCount_other: "{{countFig}} parts",
            partsAttention_one: "{{countFig}} needs attention",
            partsAttention_other: "{{countFig}} need attention",
            salesNone: "No sales yet today",
            salesToday_one: "{{countFig}} sale today · {{totalFig}}",
            salesToday_other: "{{countFig}} sales today · {{totalFig}}",
            customersCount_one: "{{countFig}} customer",
            customersCount_other: "{{countFig}} customers",
            errorLoad: "Couldn't load summary: {{error}}",
        },
        parts: {
            docTitle: "Parts - Mertory",
            title: "Parts",
            newBtn: "+ New Part",
            searchLabel: "Search: part name, OE number, brand, vehicle make/model",
            searchPlaceholder: "Search: part name, OE no., brand, vehicle make/model…",
            table: {
                name: "Part Name", oeNumber: "OE No.", brand: "Brand", vehicle: "Vehicle",
                condition: "Condition", stock: "Stock", buyPrice: "Buy", sellPrice: "Sell",
                stockStatus: "Stock Status", actions: "Actions",
            },
            empty: {
                title: "No parts added yet",
                body: "Add your first part to start tracking stock.",
                searchTitle: "No results found",
                searchBody: "No parts match \"{{term}}\".",
                clearSearch: "Clear search",
                newBtn: "+ New Part",
            },
            dialog: {
                newTitle: "New Part", editTitle: "Edit Part",
                name: "Part Name *", nameError: "Part name is required.",
                oeNumber: "OE Number",
                condition: "Condition", conditionNew: "New", conditionRefurbished: "Refurbished",
                brand: "Brand", vehicleType: "Vehicle Type", vehicleBrand: "Vehicle Make", vehicleModel: "Vehicle Model",
                chassisCode: "Chassis Code (optional)",
                isRemanufactured: "Remanufactured part (core exchange)",
                coreCharge: "Core Charge (€)",
                stock: "Stock Quantity", buyPrice: "Buy Price (€)", sellPrice: "Sell Price (€)",
            },
            vehicleType: {
                car: "Car", truck: "Truck", motorcycle: "Motorcycle",
                bus: "Bus", agri: "Agricultural/Construction",
            },
            filter: {
                allVehicleTypes: "All Vehicle Types",
                vehicleTypeLabel: "Filter by vehicle type",
            },
            pill: { inStock: "In Stock", lowStock: "Low Stock", outOfStock: "Out of Stock" },
            toast: {
                added: "Part added.", updated: "Part updated.", deleted: "Part deleted.",
                fetchError: "Couldn't load part: {{error}}",
            },
            confirmDelete: "Are you sure you want to delete this part? This can't be undone.",
            errorLoad: "Couldn't load parts: {{error}}",
        },
        sales: {
            docTitle: "Sales - Mertory",
            title: "Sales",
            newBtn: "+ New Sale",
            newBtnDisabledHint: "Add at least one part first",
            table: {
                date: "Date", part: "Part", customer: "Customer", quantity: "Qty",
                amount: "Amount", core: "Core", note: "Note", actions: "Actions", deletedPart: "Deleted part",
            },
            empty: {
                title: "No sales yet",
                body: "Record your first sale to get started.",
                needsPart: "Add at least one part before recording a sale.",
                goToParts: "Go to Parts",
                newBtn: "+ New Sale",
                noPendingCoresTitle: "No cores pending",
                noPendingCoresBody: "All core returns are settled.",
            },
            dialog: {
                newTitle: "New Sale",
                part: "Part *", partError: "Please select a part.",
                customer: "Customer (optional)", customerNone: "— None selected —",
                quantity: "Quantity",
                price: "Sale Price (€) *", priceError: "Enter a valid sale price.",
                note: "Note",
                stockWarning: "Not enough stock: only {{stock}} left.",
                stockLabel: "Stock: {{stock}}",
                outOfStockSuffix: " — Out of stock",
                coreReturned: "Was the old part (core) returned?",
                totalLabel: "Total",
                coreChargeNote: "Includes a €{{amount}} core deposit — refunded when the old part is returned.",
                coreWaivedNote: "No core deposit charged — the old part was handed over.",
            },
            pill: { corePending: "Pending", coreReceived: "Received" },
            toolbar: { pendingCoreOnly: "Pending cores only" },
            action: { markCoreReturned: "Core Received" },
            toast: {
                added: "Sale recorded.", deleted: "Sale deleted.",
                refDataError: "Couldn't load latest data: {{error}}",
                coreUpdated: "Core status updated.",
            },
            confirmDelete: "Are you sure you want to delete this sale? The part's stock will be restored.",
            errorLoad: "Couldn't load sales: {{error}}",
            errorLoadAll: "Couldn't load data: {{error}}",
        },
        customers: {
            docTitle: "Customers - Mertory",
            title: "Customers",
            newBtn: "+ New Customer",
            searchLabel: "Search: name, phone",
            searchPlaceholder: "Search: name, phone…",
            table: {
                name: "Full Name", phone: "Phone", email: "Email",
                salesCount: "Sales", totalAmount: "Total", actions: "Actions",
            },
            empty: {
                title: "No customers added yet",
                body: "Add your first customer to get started.",
                searchTitle: "No results found",
                searchBody: "No customers match \"{{term}}\".",
                clearSearch: "Clear search",
                newBtn: "+ New Customer",
            },
            dialog: {
                newTitle: "New Customer", editTitle: "Edit Customer",
                name: "Full Name *", nameError: "Full name is required.",
                phone: "Phone",
                email: "Email", emailError: "Enter a valid email address.",
            },
            toast: {
                added: "Customer added.", updated: "Customer updated.", deleted: "Customer deleted.",
                fetchError: "Couldn't load customer: {{error}}",
            },
            confirmDelete: "Are you sure you want to delete this customer? This can't be undone.",
            errorLoad: "Couldn't load customers: {{error}}",
        },
        reports: {
            docTitle: "Reports - Mertory",
            title: "Reports",
            range: {
                today: "Today", week: "This Week", month: "This Month", all: "All Time", custom: "Custom",
                startLabel: "Start", endLabel: "End",
            },
            stats: {
                salesCount: "Total Sales", revenue: "Total Revenue", cost: "Total Cost",
                netProfit: "Net Profit", pendingCores: "Pending Cores",
            },
            topParts: {
                title: "Best-Selling Parts",
                desc: "Top 5 by quantity in the selected range",
                qty_one: "{{count}} unit",
                qty_other: "{{count}} units",
                empty: "No sales in this range.",
            },
            lowStock: {
                title: "Low-Stock Parts",
                desc: "Parts that need attention",
                empty: "No parts need attention.",
            },
            errorLoad: "Couldn't load report data: {{error}}",
        },
        settings: {
            docTitle: "Settings - Mertory",
            title: "Settings",
            languageTitle: "Language",
            languageBody: "Choose the app's language. Your choice is remembered on this device.",
            lang: { trHint: "", enHint: "", deHint: "" },
            darkMode: {
                title: "Appearance",
                label: "Dark Mode",
                hint: "Use a dark background. Your choice is remembered on this device.",
            },
            business: {
                title: "Business Info",
                name: "Business Name",
                address: "Address",
                phone: "Phone",
            },
            data: {
                title: "Data & Backup",
                body: "Download all part, sale, and customer records as CSV files.",
                exportBtn: "Export Data",
                exportSuccess: "Data exported.",
                exportError: "Export failed: {{error}}",
            },
            backups: {
                title: "Backups",
                body: "A backup of the database. One automatic backup is taken per day, the first time the app is opened.",
                lastLabel: "Last backup:",
                none: "No backup yet",
                nowBtn: "Back Up Now",
                downloadBtn: "Download",
                empty: "No backups yet.",
                success: "Backup created.",
                error: "Backup failed: {{error}}",
            },
            about: {
                title: "About",
                appName: "Mertory — Workshop Management System",
                versionLabel: "Version",
            },
        },
    },

    de: {
        nav: { home: "Startseite", parts: "Teile", sales: "Verkäufe", customers: "Kunden", reports: "Berichte", settings: "Einstellungen" },
        skip: { link: "Zum Inhalt springen" },
        common: {
            cancel: "Abbrechen",
            save: "Speichern",
            edit: "Bearbeiten",
            delete: "Löschen",
            retry: "Erneut versuchen",
            close: "Schließen",
            confirmTitle: "Sind Sie sicher?",
            connectError: "Verbindung zum Server nicht möglich. Bitte prüfen Sie, ob das Backend läuft.",
            deleteFailed: "Löschen fehlgeschlagen: {{error}}",
            saveFailed: "Speichern fehlgeschlagen: {{error}}",
        },
        home: {
            docTitle: "Mertory | Werkstattverwaltung",
            title: "Startseite",
            loading: "Wird geladen…",
            partsRowTitle: "Teile",
            salesRowTitle: "Verkäufe",
            customersRowTitle: "Kunden",
            partsCount_one: "{{countFig}} Teil",
            partsCount_other: "{{countFig}} Teile",
            partsAttention_one: "{{countFig}} braucht Aufmerksamkeit",
            partsAttention_other: "{{countFig}} brauchen Aufmerksamkeit",
            salesNone: "Heute noch keine Verkäufe",
            salesToday_one: "Heute {{countFig}} Verkauf · {{totalFig}}",
            salesToday_other: "Heute {{countFig}} Verkäufe · {{totalFig}}",
            customersCount_one: "{{countFig}} Kunde",
            customersCount_other: "{{countFig}} Kunden",
            errorLoad: "Übersicht konnte nicht geladen werden: {{error}}",
        },
        parts: {
            docTitle: "Teile - Mertory",
            title: "Teile",
            newBtn: "+ Neues Teil",
            searchLabel: "Suche: Teilename, OE-Nummer, Marke, Fahrzeugmarke/-modell",
            searchPlaceholder: "Suche: Teilename, OE-Nr., Marke, Fahrzeugmarke/-modell…",
            table: {
                name: "Teilename", oeNumber: "OE-Nr.", brand: "Marke", vehicle: "Fahrzeug",
                condition: "Zustand", stock: "Bestand", buyPrice: "Einkauf", sellPrice: "Verkauf",
                stockStatus: "Lagerstatus", actions: "Aktionen",
            },
            empty: {
                title: "Noch keine Teile hinzugefügt",
                body: "Fügen Sie Ihr erstes Teil hinzu, um mit der Bestandsverwaltung zu beginnen.",
                searchTitle: "Keine Ergebnisse gefunden",
                searchBody: "Keine Teile entsprechen \"{{term}}\".",
                clearSearch: "Suche zurücksetzen",
                newBtn: "+ Neues Teil",
            },
            dialog: {
                newTitle: "Neues Teil", editTitle: "Teil bearbeiten",
                name: "Teilename *", nameError: "Teilename ist erforderlich.",
                oeNumber: "OE-Nummer",
                condition: "Zustand", conditionNew: "Neu", conditionRefurbished: "Aufbereitet",
                brand: "Marke", vehicleType: "Fahrzeugtyp", vehicleBrand: "Fahrzeugmarke", vehicleModel: "Fahrzeugmodell",
                chassisCode: "Fahrgestellnummer (optional)",
                isRemanufactured: "Aufbereitetes Teil (Pfandsystem)",
                coreCharge: "Pfandgebühr (€)",
                stock: "Bestandsmenge", buyPrice: "Einkaufspreis (€)", sellPrice: "Verkaufspreis (€)",
            },
            vehicleType: {
                car: "PKW", truck: "LKW", motorcycle: "Motorrad",
                bus: "Bus", agri: "Landwirtschaft/Baumaschinen",
            },
            filter: {
                allVehicleTypes: "Alle Fahrzeugtypen",
                vehicleTypeLabel: "Nach Fahrzeugtyp filtern",
            },
            pill: { inStock: "Auf Lager", lowStock: "Wenig Bestand", outOfStock: "Ausverkauft" },
            toast: {
                added: "Teil hinzugefügt.", updated: "Teil aktualisiert.", deleted: "Teil gelöscht.",
                fetchError: "Teil konnte nicht geladen werden: {{error}}",
            },
            confirmDelete: "Möchten Sie dieses Teil wirklich löschen? Dies kann nicht rückgängig gemacht werden.",
            errorLoad: "Teile konnten nicht geladen werden: {{error}}",
        },
        sales: {
            docTitle: "Verkäufe - Mertory",
            title: "Verkäufe",
            newBtn: "+ Neuer Verkauf",
            newBtnDisabledHint: "Fügen Sie zuerst mindestens ein Teil hinzu",
            table: {
                date: "Datum", part: "Teil", customer: "Kunde", quantity: "Menge",
                amount: "Betrag", core: "Pfand", note: "Notiz", actions: "Aktionen", deletedPart: "Gelöschtes Teil",
            },
            empty: {
                title: "Noch keine Verkäufe",
                body: "Erfassen Sie Ihren ersten Verkauf, um loszulegen.",
                needsPart: "Fügen Sie zuerst mindestens ein Teil hinzu, bevor Sie einen Verkauf erfassen.",
                goToParts: "Zu den Teilen",
                newBtn: "+ Neuer Verkauf",
                noPendingCoresTitle: "Keine offenen Pfandrückgaben",
                noPendingCoresBody: "Alle Pfandrückgaben sind abgeschlossen.",
            },
            dialog: {
                newTitle: "Neuer Verkauf",
                part: "Teil *", partError: "Bitte wählen Sie ein Teil aus.",
                customer: "Kunde (optional)", customerNone: "— Nicht ausgewählt —",
                quantity: "Menge",
                price: "Verkaufspreis (€) *", priceError: "Geben Sie einen gültigen Verkaufspreis ein.",
                note: "Notiz",
                stockWarning: "Nicht genug Bestand: nur noch {{stock}} vorhanden.",
                stockLabel: "Bestand: {{stock}}",
                outOfStockSuffix: " — Ausverkauft",
                coreReturned: "Wurde das Altteil zurückgegeben?",
                totalLabel: "Gesamt",
                coreChargeNote: "Enthält eine Pfandgebühr von €{{amount}} — wird bei Rückgabe des Altteils erstattet.",
                coreWaivedNote: "Keine Pfandgebühr — das Altteil wurde übergeben.",
            },
            pill: { corePending: "Ausstehend", coreReceived: "Erhalten" },
            toolbar: { pendingCoreOnly: "Nur offene Pfandrückgaben" },
            action: { markCoreReturned: "Pfand erhalten" },
            toast: {
                added: "Verkauf erfasst.", deleted: "Verkauf gelöscht.",
                refDataError: "Aktuelle Daten konnten nicht geladen werden: {{error}}",
                coreUpdated: "Pfandstatus aktualisiert.",
            },
            confirmDelete: "Möchten Sie diesen Verkauf wirklich löschen? Der Teilebestand wird wiederhergestellt.",
            errorLoad: "Verkäufe konnten nicht geladen werden: {{error}}",
            errorLoadAll: "Daten konnten nicht geladen werden: {{error}}",
        },
        customers: {
            docTitle: "Kunden - Mertory",
            title: "Kunden",
            newBtn: "+ Neuer Kunde",
            searchLabel: "Suche: Name, Telefon",
            searchPlaceholder: "Suche: Name, Telefon…",
            table: {
                name: "Name", phone: "Telefon", email: "E-Mail",
                salesCount: "Verkäufe", totalAmount: "Gesamt", actions: "Aktionen",
            },
            empty: {
                title: "Noch keine Kunden hinzugefügt",
                body: "Fügen Sie Ihren ersten Kunden hinzu, um loszulegen.",
                searchTitle: "Keine Ergebnisse gefunden",
                searchBody: "Keine Kunden entsprechen \"{{term}}\".",
                clearSearch: "Suche zurücksetzen",
                newBtn: "+ Neuer Kunde",
            },
            dialog: {
                newTitle: "Neuer Kunde", editTitle: "Kunde bearbeiten",
                name: "Name *", nameError: "Name ist erforderlich.",
                phone: "Telefon",
                email: "E-Mail", emailError: "Geben Sie eine gültige E-Mail-Adresse ein.",
            },
            toast: {
                added: "Kunde hinzugefügt.", updated: "Kunde aktualisiert.", deleted: "Kunde gelöscht.",
                fetchError: "Kunde konnte nicht geladen werden: {{error}}",
            },
            confirmDelete: "Möchten Sie diesen Kunden wirklich löschen? Dies kann nicht rückgängig gemacht werden.",
            errorLoad: "Kunden konnten nicht geladen werden: {{error}}",
        },
        reports: {
            docTitle: "Berichte - Mertory",
            title: "Berichte",
            range: {
                today: "Heute", week: "Diese Woche", month: "Dieser Monat", all: "Gesamter Zeitraum", custom: "Benutzerdefiniert",
                startLabel: "Start", endLabel: "Ende",
            },
            stats: {
                salesCount: "Verkäufe gesamt", revenue: "Umsatz gesamt", cost: "Kosten gesamt",
                netProfit: "Nettogewinn", pendingCores: "Offene Pfandrückgaben",
            },
            topParts: {
                title: "Meistverkaufte Teile",
                desc: "Top 5 nach Menge im gewählten Zeitraum",
                qty_one: "{{count}} Stück",
                qty_other: "{{count}} Stück",
                empty: "Keine Verkäufe in diesem Zeitraum.",
            },
            lowStock: {
                title: "Teile mit wenig Bestand",
                desc: "Teile, die Aufmerksamkeit brauchen",
                empty: "Keine Teile brauchen Aufmerksamkeit.",
            },
            errorLoad: "Berichtsdaten konnten nicht geladen werden: {{error}}",
        },
        settings: {
            docTitle: "Einstellungen - Mertory",
            title: "Einstellungen",
            languageTitle: "Sprache",
            languageBody: "Wählen Sie die Sprache der App. Ihre Auswahl wird auf diesem Gerät gespeichert.",
            lang: { trHint: "", enHint: "", deHint: "Für die meisten Kunden in Berlin" },
            darkMode: {
                title: "Darstellung",
                label: "Dunkler Modus",
                hint: "Dunklen Hintergrund verwenden. Ihre Auswahl wird auf diesem Gerät gespeichert.",
            },
            business: {
                title: "Geschäftsangaben",
                name: "Firmenname",
                address: "Adresse",
                phone: "Telefon",
            },
            data: {
                title: "Daten & Sicherung",
                body: "Alle Teile-, Verkaufs- und Kundendaten als CSV-Dateien herunterladen.",
                exportBtn: "Daten exportieren",
                exportSuccess: "Daten exportiert.",
                exportError: "Export fehlgeschlagen: {{error}}",
            },
            backups: {
                title: "Sicherungen",
                body: "Eine Sicherung der Datenbank. Beim ersten Öffnen der App pro Tag wird automatisch eine Sicherung erstellt.",
                lastLabel: "Letzte Sicherung:",
                none: "Noch keine Sicherung",
                nowBtn: "Jetzt sichern",
                downloadBtn: "Herunterladen",
                empty: "Noch keine Sicherungen.",
                success: "Sicherung erstellt.",
                error: "Sicherung fehlgeschlagen: {{error}}",
            },
            about: {
                title: "Über",
                appName: "Mertory — Werkstattverwaltung",
                versionLabel: "Version",
            },
        },
    },
};

function getStoredLang() {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    return SUPPORTED_LANGS.includes(stored) ? stored : DEFAULT_LANG;
}

let currentLang = getStoredLang();

function lookup(dict, key) {
    return key.split(".").reduce((obj, part) => (obj && typeof obj === "object") ? obj[part] : undefined, dict);
}

function t(key, params) {
    let resolvedKey = key;
    if (params && typeof params.count === "number") {
        const pluralKey = key + (params.count === 1 ? "_one" : "_other");
        if (lookup(translations[currentLang], pluralKey) !== undefined) {
            resolvedKey = pluralKey;
        }
    }
    let str = lookup(translations[currentLang], resolvedKey);
    if (str === undefined) str = lookup(translations[DEFAULT_LANG], resolvedKey);
    if (typeof str !== "string") str = key;
    if (params) {
        for (const [paramKey, value] of Object.entries(params)) {
            str = str.split(`{{${paramKey}}}`).join(value);
        }
    }
    return str;
}

function currentLocale() {
    return LOCALE_BY_LANG[currentLang] || LOCALE_BY_LANG[DEFAULT_LANG];
}

function applyTranslations(root) {
    root = root || document;
    root.querySelectorAll("[data-i18n]").forEach((el) => {
        el.textContent = t(el.getAttribute("data-i18n"));
    });
    root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    root.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
        el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria-label")));
    });
    const titleMeta = document.querySelector('meta[name="i18n-title"]');
    if (titleMeta) {
        document.title = t(titleMeta.getAttribute("content"));
    }
    document.documentElement.lang = currentLang;
}

function updateLangSwitchUI() {
    document.querySelectorAll(".lang-menu-item[data-lang-option]").forEach((el) => {
        const isActive = el.getAttribute("data-lang-option") === currentLang;
        if (isActive) el.setAttribute("aria-current", "true");
        else el.removeAttribute("aria-current");
    });
    document.querySelectorAll("input[type=radio][data-lang-option]").forEach((input) => {
        input.checked = input.getAttribute("data-lang-option") === currentLang;
    });
    document.querySelectorAll(".lang-trigger-label").forEach((el) => {
        el.textContent = currentLang.toUpperCase();
    });
}

function setLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang) || lang === currentLang) return;
    currentLang = lang;
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    applyTranslations();
    updateLangSwitchUI();
    document.dispatchEvent(new CustomEvent("i18n:langchange", { detail: { lang } }));
}

function initLangSwitch() {
    document.querySelectorAll(".lang-switch").forEach((wrapper) => {
        const trigger = wrapper.querySelector(".lang-trigger");
        const menu = wrapper.querySelector(".lang-menu");
        if (!trigger || !menu) return;

        const closeMenu = () => {
            menu.classList.remove("is-open");
            trigger.setAttribute("aria-expanded", "false");
        };
        const openMenu = () => {
            menu.classList.add("is-open");
            trigger.setAttribute("aria-expanded", "true");
            // Right-aligned by default; flip to left-aligned if that would
            // push the menu past the left edge of the viewport (the
            // trigger can wrap to the header's left side on narrow screens).
            const wrapperRect = wrapper.getBoundingClientRect();
            const overflowsLeft = wrapperRect.right - menu.offsetWidth < 0;
            menu.classList.toggle("lang-menu--align-left", overflowsLeft);
        };

        trigger.addEventListener("click", (event) => {
            event.stopPropagation();
            if (menu.classList.contains("is-open")) closeMenu();
            else openMenu();
        });

        menu.querySelectorAll(".lang-menu-item[data-lang-option]").forEach((btn) => {
            btn.addEventListener("click", () => {
                setLang(btn.getAttribute("data-lang-option"));
                closeMenu();
                trigger.focus();
            });
        });

        document.addEventListener("click", (event) => {
            if (!wrapper.contains(event.target)) closeMenu();
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeMenu();
        });
    });

    document.querySelectorAll("input[type=radio][data-lang-option]").forEach((input) => {
        input.addEventListener("change", () => {
            if (input.checked) setLang(input.getAttribute("data-lang-option"));
        });
    });
    updateLangSwitchUI();
}

applyTranslations();
initLangSwitch();
