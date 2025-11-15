let historialConversiones = JSON.parse(localStorage.getItem('transaccion')) || [];
const valores = []
let contadorId = historialConversiones.length > 0 ? historialConversiones[historialConversiones.length - 1].id + 1 : 1;
const url = 'https://dolarapi.com/v1/cotizaciones'
let formularioInformacion = document.getElementById('conversionForm');
let deleteHistoryBtn = document.getElementById('clearHistoryBtn');
let historyContainer = document.getElementById('historialList');
let ordenarBoton = document.getElementById('ordenarHistorialBtn');
let nuevaTransaccion = document.createElement('li');



async function DATA_API(){
    try{
        const response = await fetch(url);
        const data = await response.json()
        valores.length = 0;

        const mapcotizaciones = data.map(cotizacion => ({
            moneda: cotizacion.moneda,
            precio: cotizacion.venta
        }));
        valores.push(...mapcotizaciones)
    }catch(e){
        console.error('hay un error', e)
    }
}

async function data(){
   await DATA_API()

   if(historialConversiones.length > 0){
    historialtransacciones(historialConversiones);
   }
}
 data()


formularioInformacion .addEventListener('submit', (e)=>{
    e.preventDefault();

    const cantidadInput = document.getElementById('cantidad');
    const selectMoneda = document.getElementById('moneda');

    const cantidadPesos = parseFloat(cantidadInput.value);
    const divisa = selectMoneda.value


    if(cantidadPesos >=1){
        exchange(divisa,cantidadPesos);
    }else{
        Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se ingreso ningun monto valido"
        });
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
            let convertido =  c / valores[i].precio
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
        const montoConvertido = h[i].convertido ? h[i].convertido.toFixed(2) : 'N/A';
        const montoArs = h[i].montoArs.toFixed(2);
        nuevoItem.innerHTML = `
        <div class="transaccion-datos">
                <h4>Transacción N°${h[i].id}</h4>
                
                <div class="par-datos">
                    <p>Moneda Elegida:</p> 
                    <p class="valor-destino">${h[i].monedaDestino}</p>
                </div>

                <div class="par-datos">
                    <p>Monto en ARS:</p> 
                    <p class="valor-ars">$${montoArs}</p>
                </div>
                
                <div class="par-datos resultado">
                    <p>Monto convertido a ${h[i].monedaDestino}:</p>
                    <p class="valor-convertido">${montoConvertido}</p>
                </div>
            </div>
    `
    historyContainer.appendChild(nuevoItem)

    }
}
let acomodarHistorial =(i)=>{
    let historialacomodado = i.sort((a,b)=> b.montoArs - a.montoArs);
    return historialacomodado;
}
