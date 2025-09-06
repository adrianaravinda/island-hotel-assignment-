document.addEventListener('DOMContentLoaded', () => {
    const roomType = document.getElementById('roomType');
    const roomCount = document.getElementById('roomCount');
    const childrenCount = document.getElementById('children');
    const extraBed = document.getElementById('extraBed');
    const promoCode = document.getElementById('promo');
    const adventureType = document.getElementById('adventureType');
    const needsGuide = document.getElementById('guide');


    const bookNowBtn = document.getElementById('bookNow');
    const bookAdventureBtn = document.getElementById('bookAdventure');
    const addFavouriteBtn = document.getElementById('addFavourite');
    const checkLoyaltyBtn = document.getElementById('checkLoyalty');

    const currentBookingDisplay = document.getElementById('currentBooking');
    const currentCostDisplay = document.getElementById('currentCost');
    const overallBookingDisplay = document.getElementById('overallBooking');
    const overallCostDisplay = document.getElementById('overallCost');

    
    let overallBookings = [];
    let overallCost = 0;

    // --- CALCULATION  ---
    function calculateRoomCost() {
        let cost = 0;
        const rooms = parseInt(roomCount.value) || 0;

        switch (roomType.value) {
            case 'single': cost += 25000 * rooms; break;
            case 'double': cost += 35000 * rooms; break;
            case 'triple': cost += 40000 * rooms; break;
        }
        cost += (parseInt(childrenCount.value) || 0) * 5000;
        if (extraBed.checked) cost += 8000;
        if (promoCode.value.trim() === 'Promo123') cost *= 0.95; // 5% discount

        return cost;
    }
    function calculateAdventureCost() {
        let cost = 0;
        const adventure = adventureType.value;
        if (adventure === 'divingLocalAdult') cost += 5000;
        if (adventure === 'divingLocalKid') cost += 2000;
        if (adventure === 'divingForeignAdult') cost += 10000;
        if (adventure === 'divingForeignKid') cost += 5000;

        if (needsGuide.checked) {
            if (adventure.includes('Adult')) cost += 1000;
            if (adventure.includes('Kid')) cost += 500;
        }
        return cost;
    }
    function updateCurrentBooking() {
        const cost = calculateRoomCost();
        const rooms = parseInt(roomCount.value) || 0;
        const type = roomType.options[roomType.selectedIndex].text.split(' - ')[0];
        currentBookingDisplay.textContent = `${rooms} x ${type} Room(s)`;
        currentCostDisplay.textContent = `${cost.toLocaleString()} LKR`;
    }
    function updateOverallDisplay() {
        overallBookingDisplay.textContent = overallBookings.length > 0 ? overallBookings.join('; ') : 'None';
        overallCostDisplay.textContent = `${overallCost.toLocaleString()} LKR`;
    }
    [roomType, roomCount, childrenCount, extraBed, promoCode].forEach(el => {
        el.addEventListener('change', updateCurrentBooking);
        el.addEventListener('input', updateCurrentBooking);
    });
    bookNowBtn.addEventListener('click', () => {
        const cost = calculateRoomCost();
        if (cost === 0) {
            alert('Please select rooms to book.');
            return;
        }
        const rooms = parseInt(roomCount.value) || 0;
        const type = roomType.options[roomType.selectedIndex].text.split(' - ')[0];
        const bookingDescription = `${rooms} x ${type}`;

        overallBookings.push(bookingDescription);
        overallCost += cost;

        updateOverallDisplay();

        currentBookingDisplay.textContent = 'None';
        currentCostDisplay.textContent = '0 LKR';

        alert('Room booking added to your overall booking!');
    });

    bookAdventureBtn.addEventListener('click', () => {
        const cost = calculateAdventureCost();
        const adventureName = adventureType.options[adventureType.selectedIndex].text.split(' (')[0];

        alert(`Thank you for booking the adventure: ${adventureName}. The total cost is ${cost.toLocaleString()} LKR. Please note: as per assignment rules, this resets all bookings.`);

        overallBookings = [];
        overallCost = 0;
        currentBookingDisplay.textContent = 'None';
        currentCostDisplay.textContent = '0 LKR';
        updateOverallDisplay();
    });

    addFavouriteBtn.addEventListener('click', () => {
        const favouriteBooking = {
            roomType: roomType.value,
            roomCount: roomCount.value,
            children: childrenCount.value,
            extraBed: extraBed.checked,
        };
        localStorage.setItem('favouriteBooking', JSON.stringify(favouriteBooking));
        alert('Your current room selection has been saved as a favourite!');
    });

    checkLoyaltyBtn.addEventListener('click', () => {
        let totalRoomsBooked = 0;
        overallBookings.forEach(booking => {
            if (booking.includes('Room')) {
                const count = parseInt(booking.split(' x ')[0]);
                totalRoomsBooked += count;
            }
        });

        if (totalRoomsBooked > 3) {
            const points = totalRoomsBooked * 20;
            localStorage.setItem('loyaltyPoints', points);
            alert(`You have earned ${points} loyalty points based on your overall booking of ${totalRoomsBooked} rooms!`);
        } else {
            const points = localStorage.getItem('loyaltyPoints') || 0;
            alert(`You need more than 3 rooms in your overall booking to earn new points. Your currently saved points: ${points}.`);
        }
    });

    updateCurrentBooking();
});