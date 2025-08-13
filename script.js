document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('monitoria-form');
    const statusMessage = document.getElementById('status-message');
    const diaSelecionadoInput = document.getElementById('dia-selecionado');
    const calendarContainer = document.getElementById('calendar-container');

    // NÚMERO DO SEU WHATSAPP (com código do país e DDD, sem símbolos)
    const meuWhatsApp = '5534997306154'; 

    const availableDaysOfWeek = [1, 3, 5]; // 0=Domingo, 1=Segunda, 2=Terça, etc.
    const availableHours = {
        1: '11h às 13h', // Segunda
        3: '11h às 13h', // Quarta
        5: '19h às 21h', // Sexta
    };

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    diaSelecionadoInput.addEventListener('focus', () => {
        calendarContainer.style.display = 'block';
        renderCalendar(currentMonth, currentYear);
    });

    document.addEventListener('click', (event) => {
        if (!calendarContainer.contains(event.target) && event.target !== diaSelecionadoInput) {
            calendarContainer.style.display = 'none';
        }
    });

    function renderCalendar(month, year) {
        calendarContainer.innerHTML = ''; 
        const date = new Date(year, month);
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
        const today = new Date();

        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.innerHTML = `
            <button type="button" class="prev-month"> &lt; </button>
            <h4>${monthNames[month]} ${year}</h4>
            <button type="button" class="next-month"> &gt; </button>
        `;
        calendarContainer.appendChild(header);

        const daysGrid = document.createElement('div');
        daysGrid.className = 'calendar-days';
        dayNames.forEach(day => {
            const dayName = document.createElement('div');
            dayName.textContent = day;
            daysGrid.appendChild(dayName);
        });
        calendarContainer.appendChild(daysGrid);

        const datesGrid = document.createElement('div');
        datesGrid.className = 'calendar-dates';
        
        for (let i = 0; i < firstDayOfMonth; i++) {
            datesGrid.innerHTML += '<div></div>';
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = document.createElement('div');
            const dayDate = new Date(year, month, i);
            const dayOfWeek = dayDate.getDay();

            dayElement.textContent = i;
            
            if (availableDaysOfWeek.includes(dayOfWeek) && (dayDate >= today || (dayDate.toDateString() === today.toDateString()))) {
                dayElement.className = 'available-day';
                dayElement.setAttribute('data-date', dayDate.toISOString());
            } else {
                dayElement.className = 'inactive-day';
            }
            datesGrid.appendChild(dayElement);
        }
        calendarContainer.appendChild(datesGrid);

        document.querySelector('.prev-month').addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar(currentMonth, currentYear);
        });

        document.querySelector('.next-month').addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar(currentMonth, currentYear);
        });

        datesGrid.addEventListener('click', (event) => {
            const selectedDayElement = event.target;
            if (selectedDayElement.classList.contains('available-day')) {
                const dayOfWeek = new Date(selectedDayElement.getAttribute('data-date')).getDay();
                const selectedDate = new Date(selectedDayElement.getAttribute('data-date'));
                const day = selectedDate.getDate();
                const monthName = monthNames[selectedDate.getMonth()];
                const dayName = dayNames[dayOfWeek];

                const fullDate = `${dayName}, ${day} de ${monthName} - ${availableHours[dayOfWeek]}`;
                diaSelecionadoInput.value = fullDate;

                document.querySelectorAll('.available-day').forEach(day => day.classList.remove('selected-day'));
                
                selectedDayElement.classList.add('selected-day');

                setTimeout(() => {
                    calendarContainer.style.display = 'none';
                }, 500);
            }
        });
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const diaSelecionado = diaSelecionadoInput.value;
        const nomeParticipante = document.getElementById('nome-participante').value;
        const materia = document.getElementById('materia').value;

        if (!diaSelecionado || !nomeParticipante || !materia) {
            statusMessage.textContent = 'Por favor, preencha todos os campos do formulário.';
            statusMessage.className = 'status-message error';
            return;
        }

        const mensagem = `Olá Natalia Salete, sou ${nomeParticipante} e gostaria de agendar uma monitoria.\n\n` +
                         `Dia/Horário: ${diaSelecionado}\n` +
                         `Matéria: ${materia}\n\n` +
                         `Link da Reunião: https://meet.google.com/jjj-cfmm-cia\n\n` +
                         `Por favor, me confirme o agendamento.`;

        const whatsappLink = `https://api.whatsapp.com/send?phone=${meuWhatsApp}&text=${encodeURIComponent(mensagem)}`;

        window.open(whatsappLink, '_blank');

        statusMessage.textContent = 'Agendamento pronto para ser enviado! Uma nova janela do WhatsApp foi aberta.';
        statusMessage.className = 'status-message success';
    });
});