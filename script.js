let historialConversiones = [];
let contadorId = 1;
let formularioInformacion = document.getElementById('conversionForm');
let deleteHistoryBtn = document.getElementById('clearHistoryBtn');
let historyContainer = document.getElementById('historialList');
let ordenarBoton = document.getElementById('ordenarHistorialBtn');
let nuevaTransaccion = document.createElement('li');


formularioInformacion .addEventListener('submit', (e)=>{
    e.preventDefault();

    const cantidadInput = document.getElementById('cantidad');
    const selectMoneda = document.getElementById('moneda');

    const cantidadPesos = parseFloat(cantidadInput.value);
    const divisa = selectMoneda.value


    if(cantidadPesos >=1){
        exchange(divisa,cantidadPesos);
    }else{
        alert('no ingreso ninguna valor')
    }
});

let exchange =(d,c)=>{

    let transacciones = {
        id: contadorId++,
        montoArs: c,
        monedaDestino: d,
    }


    for(let i=0; i<valores.length; i++){                                                                    
        if(d==valores[i].moneda){
            let convertido =  c * valores[i].precio
            if(convertido){
                transacciones.convertido = convertido;
                historialConversiones.push(transacciones);
                localStorage.setItem('transaccion', JSON.stringify(historialConversiones));
                historialtransacciones(historialConversiones);
                acomodarHistorial(historialConversiones);
            }
        }
    }
}

deleteHistoryBtn.addEventListener('click', ()=>{
        localStorage.removeItem('transaccion');
        historialConversiones = [];
        contadorId = 1;
        historyContainer.innerHTML = '';
    })

ordenarBoton.addEventListener('click', ()=>{
    acomodarHistorial(historialConversiones);
    historialtransacciones(historialConversiones)
})

let historialtransacciones = (h)=>{
    historyContainer.innerHTML = ''
    for(let i = 0; i<h.length; i++){
        const nuevoItem = document.createElement('li');
        nuevoItem.innerHTML = `
        <div>
            <h4>transaccion n${h[i].id}</h4>
            <p>Moneda Elegida: ${h[i].monedaDestino}</p>
            <p>Monto en ARS: ${h[i].montoArs}</p>
            <p>Monto convertido a ${h[i].monedaDestino}: ${h[i].convertido}</p>

        </div>
    `
    historyContainer.appendChild(nuevoItem)

    }
}
let acomodarHistorial =(i)=>{
    let historialacomodado = i.sort((a,b)=> b.montoArs - a.montoArs);
    return historialacomodado;
}
const valores = [
    {id: 1, moneda:'USD', precio: 1570},
    {id: 2, moneda:'EUR', precio: 1730},
    {id: 3, moneda:'BRL', precio: 240},
]

