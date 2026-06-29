import type { Metadata } from 'next'
import MainLayout from '@/components/layout/MainLayout'

export const metadata: Metadata = {
  title: 'Términos y condiciones — AUTODUX',
}

const H2 = 'text-xl font-bold text-white mt-10 mb-3'
const H3 = 'text-base font-bold text-white mt-6 mb-2'
const P = 'text-gray-400 text-sm leading-relaxed mb-3'
const UL = 'list-disc pl-5 space-y-1.5 text-gray-400 text-sm leading-relaxed mb-3'
const LINK = 'text-[#FFC107] hover:underline'

export default function TerminosPage() {
  return (
    <MainLayout>
      <div className="bg-[#0D0F14] min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Términos y condiciones de uso
          </h1>
          <p className="text-xs text-gray-600 mb-8">AUTODUX</p>

          <h2 className={H2}>1. Identificación del titular</h2>
          <p className={P}>El presente sitio web (en adelante, la &quot;Plataforma&quot;) es operado por:</p>
          <ul className={UL}>
            <li>Titular: Abril Duarte</li>
            <li>CUIT: 27-46465111-5</li>
            <li>Condición fiscal: Monotributista</li>
            <li>Domicilio legal: Calle 3117 N° 756, Comodoro Rivadavia, Provincia de Chubut, República Argentina</li>
            <li>Correo electrónico de contacto: grupoautodux@gmail.com</li>
            <li>Sitio web: <a href="https://www.autodux.com.ar" className={LINK}>www.autodux.com.ar</a></li>
          </ul>
          <p className={P}>
            La marca AUTODUX y su logotipo se encuentran registrados ante el Instituto Nacional de la Propiedad
            Industrial (INPI), Actas N° 4730049 y N° 4730050, en las Clases 35 y 42 del Clasificador Internacional de
            Niza.
          </p>

          <h2 className={H2}>2. Aceptación de los términos</h2>
          <p className={P}>
            El acceso, navegación y utilización de la Plataforma implica la aceptación plena, expresa e incondicional de
            los presentes Términos y Condiciones (los &quot;Términos&quot;), así como de la Política de Privacidad y demás
            políticas complementarias publicadas en la Plataforma, las cuales forman parte integrante de este
            documento.
          </p>
          <p className={P}>
            Si el Usuario no acepta estos Términos en su totalidad, deberá abstenerse de utilizar la Plataforma.
          </p>
          <p className={P}>
            El uso de la Plataforma está reservado exclusivamente a personas mayores de 18 años con capacidad legal
            para contratar conforme a la legislación argentina vigente. El acceso por parte de menores de edad queda
            expresamente prohibido.
          </p>

          <h2 className={H2}>3. Naturaleza del servicio</h2>
          <p className={P}>
            AUTODUX es una plataforma digital de clasificados online de vehículos nuevos y usados que facilita la
            publicación de anuncios y el contacto entre Usuarios. La Plataforma opera principalmente en la región
            patagónica de la República Argentina, sin perjuicio de su acceso desde cualquier punto del país.
          </p>
          <p className={P}>
            AUTODUX actúa exclusivamente como intermediario tecnológico y no interviene en la negociación, celebración
            ni ejecución de operaciones de compraventa de vehículos. En ningún caso AUTODUX es propietario, vendedor,
            comitente ni parte en las operaciones que se generen entre Usuarios.
          </p>
          <p className={P}>
            Determinadas funcionalidades de la Plataforma, incluyendo la visualización de precios y el contacto directo
            con vendedores o agencias, requieren el registro previo del Usuario. Dicho requisito tiene por finalidad
            garantizar la calidad de los contactos recibidos por los anunciantes y la seguridad general de la comunidad
            de Usuarios.
          </p>
          <p className={P}>
            La Plataforma puede incluir espacios publicitarios de terceros. AUTODUX no avala ni garantiza los productos,
            servicios o contenidos promocionados por dichos terceros.
          </p>

          <h2 className={H2}>4. Capacidad y Usuarios</h2>
          <p className={P}>Podrán registrarse en la Plataforma:</p>
          <ul className={UL}>
            <li><strong className="text-gray-300">Usuarios particulares:</strong> Personas humanas mayores de 18 años con capacidad legal para contratar conforme a la legislación argentina vigente.</li>
            <li><strong className="text-gray-300">Usuarios agencia:</strong> Personas humanas o jurídicas (empresas, concesionarias, agencias de vehículos) con capacidad legal para contratar y desarrollar actividad comercial en la República Argentina.</li>
          </ul>
          <p className={P}>
            El Usuario declara bajo su responsabilidad que toda la información proporcionada al momento del registro es
            veraz, completa y actualizada, y se compromete a mantenerla así durante toda su permanencia en la
            Plataforma.
          </p>
          <p className={P}>
            AUTODUX podrá implementar mecanismos de verificación de identidad y/o actividad comercial en cualquier
            momento, sin que ello genere derecho a reclamo alguno por parte del Usuario. Asimismo, AUTODUX se reserva
            el derecho de rechazar, suspender o cancelar registros sin expresión de causa, especialmente ante indicios
            de información falsa, suplantación de identidad o uso indebido de la Plataforma.
          </p>

          <h2 className={H2}>5. Registro y seguridad de la cuenta</h2>
          <p className={P}>
            Para acceder a las funcionalidades restringidas de la Plataforma, el Usuario deberá crear una cuenta
            proporcionando información veraz y actualizada. Cada Usuario podrá mantener una única cuenta activa, salvo
            los Usuarios agencia que operen bajo un perfil habilitado por AUTODUX.
          </p>
          <p className={P}>
            El Usuario es el único responsable de la confidencialidad de sus credenciales de acceso (usuario y
            contraseña) y de todas las actividades realizadas desde su cuenta, sean o no de su autoría. AUTODUX no será
            responsable por pérdidas o daños derivados del uso no autorizado de credenciales.
          </p>
          <p className={P}>
            Ante cualquier uso no autorizado de su cuenta o brecha de seguridad, el Usuario deberá notificarlo de
            inmediato a AUTODUX mediante correo electrónico a grupoautodux@gmail.com. AUTODUX adoptará las medidas
            razonables a su alcance pero no garantiza la resolución inmediata de dichos incidentes.
          </p>
          <p className={P}>
            La Plataforma podrá ofrecer acceso mediante cuentas de terceros (como Google u otros proveedores). En tal
            caso, el Usuario acepta también los términos y condiciones del proveedor correspondiente.
          </p>
          <p className={P}>
            AUTODUX podrá suspender o cancelar cuentas sin previo aviso ni expresión de causa, en particular ante
            indicios de uso fraudulento, suplantación de identidad, incumplimiento de estos Términos o inactividad
            prolongada superior a doce (12) meses.
          </p>

          <h2 className={H2}>6. Publicaciones y planes</h2>

          <h3 className={H3}>6.1 Planes y límites de publicación</h3>
          <p className={P}>
            La Plataforma ofrece distintos planes de publicación para Usuarios particulares y Usuarios agencia, con
            diferentes límites de anuncios activos, publicaciones destacadas y servicios adicionales. Los planes
            vigentes, sus características y condiciones económicas se encuentran detallados en la página de Planes de
            la Plataforma (autodux.com.ar/planes), la cual forma parte integrante de estos Términos y podrá ser
            actualizada por AUTODUX en cualquier momento.
          </p>
          <p className={P}>
            Las promociones de lanzamiento u ofertas especiales estarán sujetas a sus propias condiciones, plazos de
            vigencia y disponibilidad, los cuales serán informados oportunamente en la Plataforma.
          </p>

          <h3 className={H3}>6.2 Obligaciones del Usuario al publicar</h3>
          <p className={P}>El Usuario que publique un vehículo garantiza que:</p>
          <ul className={UL}>
            <li>Es el propietario del vehículo o cuenta con autorización expresa para su venta.</li>
            <li>Toda la información suministrada en la publicación, incluyendo descripción, estado, kilometraje, precio, condiciones de venta e imágenes, es veraz, clara, completa y actualizada.</li>
            <li>El vehículo no registra impedimentos legales, prendas, embargos, inhibiciones ni ninguna otra restricción que afecte su libre disponibilidad, o en caso de tenerlos, los declara expresamente en la publicación.</li>
            <li>El precio publicado corresponde a un valor real de venta del vehículo. Queda expresamente prohibida la utilización de valores ficticios, irrisorios, simbólicos o engañosos, así como aquellos cargados con el único fin de obtener mayor visibilidad o alterar el posicionamiento de la publicación.</li>
          </ul>

          <h3 className={H3}>6.3 Vigencia y renovación de publicaciones</h3>
          <p className={P}>
            Las publicaciones tendrán la vigencia establecida en el plan contratado. Vencido dicho plazo, la
            publicación podrá ser renovada conforme a las condiciones vigentes al momento de la renovación. AUTODUX no
            garantiza la disponibilidad indefinida de publicaciones vencidas ni el mantenimiento de las condiciones
            originales de contratación.
          </p>

          <h3 className={H3}>6.4 Baja de publicaciones</h3>
          <p className={P}>
            El Usuario podrá dar de baja sus publicaciones en cualquier momento desde su panel de control. La baja de
            una publicación no genera derecho a reembolso de ningún tipo por el período no utilizado, salvo disposición
            expresa en contrario establecida en el plan contratado.
          </p>

          <h2 className={H2}>7. Contenido prohibido</h2>
          <p className={P}>Queda expresamente prohibido publicar, transmitir o compartir en la Plataforma contenidos que:</p>
          <ul className={UL}>
            <li>Refieran a vehículos robados, con documentación adulterada, patente clonada, número de chasis o motor alterado, o con cualquier otro tipo de irregularidad legal o registral.</li>
            <li>Sean falsos, engañosos, incompletos o que induzcan a error a otros Usuarios respecto al estado, características, historial o condiciones de venta del vehículo.</li>
            <li>Constituyan duplicaciones del mismo vehículo en múltiples publicaciones simultáneas o spam de cualquier tipo.</li>
            <li>Sean ilícitos, difamatorios, obscenos, discriminatorios o fraudulentos.</li>
            <li>Incluyan virus, malware, código malicioso o cualquier elemento que pueda dañar la Plataforma o los dispositivos de otros Usuarios.</li>
            <li>Utilicen la Plataforma para contactar Usuarios con fines ajenos a la compraventa de vehículos, incluyendo publicidad no autorizada, phishing o cualquier forma de engaño.</li>
            <li>Infrinjan derechos de propiedad intelectual de terceros, incluyendo imágenes, marcas o contenidos sujetos a derechos de autor.</li>
            <li>Correspondan a vehículos que no se encuentren disponibles para la venta al momento de la publicación.</li>
          </ul>
          <p className={P}>
            AUTODUX podrá remover contenidos, pausar o suspender publicaciones y cancelar cuentas sin previo aviso ante
            la detección de cualquiera de las conductas descriptas, sin que ello genere derecho a reclamo,
            compensación o indemnización alguna a favor del Usuario.
          </p>

          <h2 className={H2}>8. Facultades de control y verificación</h2>
          <p className={P}>
            AUTODUX se reserva el derecho, mas no la obligación, de monitorear, revisar, observar, pausar, ocultar,
            rechazar o remover publicaciones, contenidos o cuentas de Usuario cuando lo considere necesario, incluyendo
            pero no limitado a los siguientes casos:
          </p>
          <ul className={UL}>
            <li>Detección de inconsistencias relevantes en la información publicada.</li>
            <li>Precios que no reflejen razonablemente un valor real de venta del vehículo.</li>
            <li>Indicios de fraude, suplantación de identidad o uso indebido de la Plataforma.</li>
            <li>Recepción de denuncias fundadas por parte de otros Usuarios.</li>
            <li>Cumplimiento de órdenes judiciales o requerimientos de autoridades competentes.</li>
          </ul>
          <p className={P}>
            El ejercicio de estas facultades no implica para AUTODUX obligación de control permanente ni
            responsabilidad por los contenidos que no hayan sido detectados o removidos. AUTODUX no garantiza la
            veracidad, integridad, exactitud ni actualidad de la información publicada por los Usuarios, la cual es de
            exclusiva responsabilidad de quien la genera.
          </p>
          <p className={P}>
            Las decisiones de AUTODUX en el ejercicio de estas facultades son de carácter discrecional y no generan
            derecho a reclamo, compensación o indemnización alguna a favor del Usuario afectado.
          </p>

          <h2 className={H2}>9. Vehículos publicados</h2>
          <p className={P}>
            AUTODUX no es propietario de los vehículos publicados en la Plataforma ni participa en ninguna etapa de su
            comercialización, transferencia, entrega o financiamiento. En consecuencia, AUTODUX no garantiza:
          </p>
          <ul className={UL}>
            <li>La existencia, disponibilidad, estado técnico ni condición legal de los vehículos publicados.</li>
            <li>La exactitud de los precios, kilometrajes, años, versiones ni cualquier otro dato informado por el Usuario publicante.</li>
            <li>La capacidad, solvencia, legitimidad ni buena fe de los vendedores o agencias.</li>
            <li>La entrega efectiva del vehículo ni el cumplimiento de las condiciones pactadas entre las partes.</li>
            <li>La ausencia de vicios ocultos, aparentes, gravámenes, prendas, embargos o inhibiciones sobre los vehículos.</li>
          </ul>
          <p className={P}>
            Toda la información publicada es provista exclusivamente por los Usuarios y debe ser verificada de forma
            independiente por el interesado antes de realizar cualquier operación. Se recomienda expresamente:
          </p>
          <ul className={UL}>
            <li>Verificar el estado registral del vehículo ante el Registro Nacional de la Propiedad del Automotor (RNPA).</li>
            <li>Realizar una inspección técnica del vehículo por un profesional habilitado.</li>
            <li>No realizar pagos ni señas sin haber verificado la documentación completa del vehículo y la identidad del vendedor.</li>
          </ul>
          <p className={P}>
            AUTODUX no será parte en ninguna disputa que surja entre Usuarios con motivo de operaciones realizadas a
            través de la Plataforma.
          </p>

          <h2 className={H2}>10. Responsabilidad y limitaciones</h2>
          <p className={P}>
            AUTODUX no será responsable, en ningún caso, por daños directos, indirectos, incidentales, especiales,
            punitivos o consecuentes, incluyendo pero no limitado a: lucro cesante, pérdida de datos, pérdida de
            oportunidades comerciales o cualquier otro perjuicio patrimonial o extrapatrimonial derivado de:
          </p>
          <ul className={UL}>
            <li>El uso o la imposibilidad de uso de la Plataforma.</li>
            <li>Operaciones, acuerdos o disputas surgidas entre Usuarios.</li>
            <li>La falsedad, inexactitud u omisión en la información publicada por Usuarios.</li>
            <li>Accesos no autorizados a cuentas de Usuario por causas no imputables a AUTODUX.</li>
            <li>Fallas técnicas, interrupciones del servicio o errores en la Plataforma.</li>
          </ul>
          <p className={P}>
            El Usuario asume plena responsabilidad por las decisiones que adopte en base a la información disponible
            en la Plataforma y por las transacciones que realice con otros Usuarios. En ningún caso la responsabilidad
            de AUTODUX podrá exceder el monto efectivamente abonado por el Usuario en concepto de servicios
            contratados durante los tres (3) meses anteriores al hecho generador del daño.
          </p>

          <h2 className={H2}>11. Uso de Internet y riesgos tecnológicos</h2>
          <p className={P}>
            AUTODUX no garantiza la disponibilidad continua, ininterrumpida ni libre de errores de la Plataforma. El
            servicio podrá verse afectado por interrupciones planificadas o imprevistas, tareas de mantenimiento,
            fallas en servicios de terceros, problemas de conectividad o causas de fuerza mayor.
          </p>
          <p className={P}>
            El Usuario acepta los riesgos inherentes al uso de Internet y de sistemas informáticos, incluyendo la
            posibilidad de interrupciones del servicio, presencia de virus o software malicioso, accesos no autorizados
            por parte de terceros, pérdida de datos o fallos en la transmisión de información.
          </p>
          <p className={P}>
            AUTODUX adoptará medidas razonables de seguridad para proteger la Plataforma, pero no garantiza la
            ausencia absoluta de vulnerabilidades ni será responsable por los perjuicios que dichas contingencias
            pudieran ocasionar al Usuario.
          </p>
          <p className={P}>
            Las interrupciones del servicio por causas no imputables a AUTODUX no darán derecho al Usuario a solicitar
            reembolsos, compensaciones ni extensiones de los planes contratados, salvo que la interrupción sea
            prolongada y exclusivamente atribuible a AUTODUX, a criterio de esta última.
          </p>

          <h2 className={H2}>12. Pagos y servicios</h2>

          <h3 className={H3}>12.1 Medios de pago</h3>
          <p className={P}>
            Los servicios pagos de la Plataforma podrán abonarse mediante transferencia bancaria o a través de los
            medios de pago disponibles en la Plataforma al momento de la contratación. AUTODUX podrá incorporar,
            modificar o discontinuar medios de pago en cualquier momento, informándolo oportunamente.
          </p>

          <h3 className={H3}>12.2 Renovación de planes</h3>
          <p className={P}>
            Los planes contratados tienen vigencia mensual y se renuevan de forma manual. El Usuario deberá abonar el
            plan correspondiente y acreditar el pago mediante el envío del comprobante a AUTODUX antes del vencimiento
            del período en curso. Transcurridos cinco (5) días corridos desde el vencimiento sin que se acredite el
            pago, la cuenta y sus publicaciones activas quedarán pausadas automáticamente hasta tanto se regularice la
            situación. La pausa de la cuenta no implica la pérdida de los datos ni de las publicaciones cargadas.
          </p>

          <h3 className={H3}>12.3 Reembolsos</h3>
          <p className={P}>
            Los pagos realizados por servicios contratados no son reembolsables, salvo en caso de error de cobro
            imputable exclusivamente a AUTODUX, como pagos duplicados o cobros por servicios no contratados. Los
            reclamos por reembolso deberán realizarse dentro de los diez (10) días corridos desde la fecha del pago
            mediante correo electrónico a grupoautodux@gmail.com, acompañando el comprobante correspondiente.
          </p>

          <h3 className={H3}>12.4 Promociones</h3>
          <p className={P}>
            AUTODUX podrá ofrecer promociones, períodos de prueba gratuitos o condiciones especiales de contratación.
            Dichas promociones estarán sujetas a sus propias condiciones y plazos de vigencia, los cuales serán
            informados en la Plataforma o por los canales de comunicación oficiales de AUTODUX. Las promociones no son
            acumulables salvo indicación expresa en contrario.
          </p>

          <h3 className={H3}>12.5 Fallas en el procesamiento</h3>
          <p className={P}>
            AUTODUX no será responsable por demoras, errores o rechazos en el procesamiento de pagos imputables a
            entidades bancarias o proveedores de servicios de cobro externos.
          </p>

          <h2 className={H2}>13. Autorización de contacto</h2>
          <p className={P}>
            Al registrarse en la Plataforma y/o al completar formularios de consulta sobre publicaciones, el Usuario
            autoriza expresamente a AUTODUX a:
          </p>
          <ul className={UL}>
            <li>Compartir sus datos de contacto (nombre, teléfono y/o correo electrónico) con el Usuario publicante correspondiente, a los efectos de facilitar la comunicación entre las partes interesadas en una operación.</li>
            <li>Contactarlo mediante los medios proporcionados al momento del registro (correo electrónico, WhatsApp u otros) para el envío de notificaciones sobre la Plataforma, novedades del servicio, vencimientos de plan y comunicaciones comerciales propias de AUTODUX.</li>
          </ul>
          <p className={P}>
            El Usuario podrá revocar en cualquier momento la autorización para recibir comunicaciones comerciales
            mediante solicitud escrita a grupoautodux@gmail.com, sin que ello afecte el uso general de la Plataforma.
          </p>
          <p className={P}>
            El tratamiento de datos personales realizado por AUTODUX se rige por la{' '}
            <a href="/privacidad" className={LINK}>Política de Privacidad</a> disponible en autodux.com.ar/privacidad, la
            cual forma parte integrante de estos Términos y Condiciones.
          </p>

          <h2 className={H2}>14. Propiedad intelectual</h2>

          <h3 className={H3}>14.1 Titularidad de AUTODUX</h3>
          <p className={P}>
            La marca AUTODUX, su logotipo, el diseño y estructura de la Plataforma, sus contenidos propios, textos,
            gráficos, interfaces, código fuente y demás elementos son propiedad de Abril Duarte y se encuentran
            protegidos por las leyes argentinas e internacionales de propiedad intelectual. La marca AUTODUX y su
            logotipo se encuentran registrados ante el INPI, Actas N° 4730049 y N° 4730050, Clases 35 y 42.
          </p>
          <p className={P}>
            Queda prohibida la reproducción, distribución, modificación o uso comercial de cualquier elemento de la
            Plataforma sin autorización expresa y escrita de AUTODUX.
          </p>

          <h3 className={H3}>14.2 Licencia sobre contenido publicado por Usuarios</h3>
          <p className={P}>
            Al publicar contenido en la Plataforma (incluyendo fotografías, descripciones, datos del vehículo y
            cualquier otro material), el Usuario otorga a AUTODUX una licencia gratuita, no exclusiva, mundial y por el
            plazo de vigencia de la publicación, para reproducir, distribuir, adaptar y utilizar dicho contenido con
            los siguientes fines:
          </p>
          <ul className={UL}>
            <li>Mostrar la publicación dentro de la Plataforma.</li>
            <li>Indexar el contenido en motores de búsqueda externos.</li>
            <li>Utilizar imágenes y descripciones en materiales promocionales, redes sociales y comunicaciones comerciales propias de AUTODUX, incluyendo Instagram, Facebook y cualquier otro canal oficial.</li>
          </ul>
          <p className={P}>
            El Usuario declara que cuenta con todos los derechos necesarios sobre el contenido que publica y que su uso
            por parte de AUTODUX no infringe derechos de terceros.
          </p>

          <h2 className={H2}>15. Enlaces y servicios de terceros</h2>
          <p className={P}>
            La Plataforma puede contener enlaces a sitios web externos, integraciones con servicios de terceros
            (incluyendo procesadores de pago, plataformas de mensajería, redes sociales y servicios de mapas) o
            publicidad de terceros.
          </p>
          <p className={P}>
            AUTODUX no controla, no avala ni asume responsabilidad alguna por el contenido, políticas de privacidad,
            disponibilidad ni prácticas comerciales de dichos sitios o servicios externos. El acceso a los mismos es de
            exclusiva responsabilidad del Usuario y se rige por los términos y condiciones propios de cada plataforma.
          </p>
          <p className={P}>
            Se recomienda al Usuario revisar las políticas de privacidad y condiciones de uso de cualquier sitio
            externo al que acceda desde la Plataforma.
          </p>

          <h2 className={H2}>16. Publicidad</h2>
          <p className={P}>
            La Plataforma podrá incluir espacios publicitarios de terceros, banners, anuncios patrocinados u otras
            formas de comunicación comercial. AUTODUX no avala ni garantiza los productos, servicios, precios ni
            condiciones ofrecidos por los anunciantes, y no será responsable por las relaciones comerciales, daños o
            perjuicios que pudieran derivarse de la interacción del Usuario con dichos anuncios.
          </p>
          <p className={P}>
            La inclusión de publicidad de terceros en la Plataforma no implica asociación, patrocinio ni respaldo de
            AUTODUX hacia el anunciante ni hacia sus productos o servicios.
          </p>
          <p className={P}>
            AUTODUX se reserva el derecho de seleccionar, rechazar o remover publicidad de terceros que considere
            incompatible con los valores de la Plataforma o contraria a la legislación vigente, sin que ello genere
            responsabilidad alguna frente al anunciante o al Usuario.
          </p>

          <h2 className={H2}>17. Indemnidad</h2>
          <p className={P}>
            El Usuario se obliga a mantener indemne a AUTODUX, su titular, directivos, empleados, colaboradores y
            afiliadas frente a cualquier reclamo, demanda, acción judicial, daño, pérdida, gasto o costo (incluyendo
            honorarios legales razonables) que pudiera surgir como consecuencia de:
          </p>
          <ul className={UL}>
            <li>El incumplimiento por parte del Usuario de cualquier disposición de estos Términos o de la legislación aplicable.</li>
            <li>La falsedad, inexactitud u omisión de información proporcionada por el Usuario al registrarse o al publicar contenido en la Plataforma.</li>
            <li>La infracción de derechos de terceros, incluyendo derechos de propiedad intelectual, mediante contenido publicado por el Usuario.</li>
            <li>Disputas surgidas entre el Usuario y otros Usuarios o terceros con motivo de operaciones realizadas a través de la Plataforma.</li>
            <li>El uso indebido, negligente o fraudulento de la Plataforma por parte del Usuario.</li>
          </ul>
          <p className={P}>
            Esta obligación de indemnidad subsistirá aun después de la baja o cancelación de la cuenta del Usuario.
          </p>

          <h2 className={H2}>18. Modificaciones</h2>
          <p className={P}>
            AUTODUX podrá modificar estos Términos en cualquier momento, publicando la versión actualizada en la
            Plataforma con indicación de la fecha de última actualización. Las modificaciones entrarán en vigencia a
            partir de su publicación. El uso continuado de la Plataforma por parte del Usuario con posterioridad a
            dicha publicación implicará la aceptación plena de los Términos modificados. Se recomienda al Usuario
            revisar periódicamente este documento. Si el Usuario no acepta las modificaciones, deberá discontinuar el
            uso de la Plataforma y solicitar la baja de su cuenta.
          </p>

          <h2 className={H2}>19. Fuerza mayor</h2>
          <p className={P}>
            AUTODUX no será responsable por el incumplimiento parcial o total de sus obligaciones cuando dicho
            incumplimiento sea consecuencia de casos fortuitos o de fuerza mayor, incluyendo pero no limitado a:
            desastres naturales, fallas generalizadas de infraestructura tecnológica, cortes de suministro eléctrico,
            actos de autoridad, cambios normativos, pandemias, conflictos sociales o cualquier otra circunstancia ajena
            a la voluntad y control razonable de AUTODUX. En tales casos, AUTODUX informará la situación a los Usuarios
            por los canales disponibles y adoptará las medidas razonables para restablecer el servicio en el menor
            tiempo posible.
          </p>

          <h2 className={H2}>20. Menores de edad</h2>
          <p className={P}>
            La Plataforma está destinada exclusivamente a personas mayores de 18 años. Queda expresamente prohibido el
            registro y uso de la Plataforma por parte de menores de edad. AUTODUX no solicita ni recopila
            intencionalmente datos personales de menores. Si se detectara el registro de un menor, la cuenta será
            cancelada de forma inmediata y los datos asociados serán eliminados conforme a la Política de Privacidad
            vigente.
          </p>

          <h2 className={H2}>21. Vigencia de publicaciones</h2>
          <p className={P}>
            Las publicaciones tendrán la vigencia establecida en el plan contratado por el Usuario, conforme a las
            condiciones detalladas en autodux.com.ar/planes. Vencido dicho plazo sin que el Usuario renueve el plan,
            las publicaciones serán pausadas automáticamente. AUTODUX no garantiza la conservación indefinida de
            publicaciones vencidas ni de los datos asociados a cuentas inactivas por un período superior a doce (12)
            meses.
          </p>

          <h2 className={H2}>22. Ley aplicable y jurisdicción</h2>
          <p className={P}>
            Los presentes Términos se rigen por las leyes de la República Argentina, en particular por el Código Civil
            y Comercial de la Nación, la Ley de Defensa del Consumidor N° 24.240 y sus modificatorias, y la Ley de
            Protección de Datos Personales N° 25.326. Toda controversia derivada de la interpretación, aplicación o
            incumplimiento de estos Términos será sometida a la jurisdicción de los tribunales ordinarios competentes
            de la ciudad de Comodoro Rivadavia, Provincia de Chubut, República Argentina, renunciando las partes a
            cualquier otro fuero que pudiera corresponderles.
          </p>

          <p className="text-xs text-gray-600 mt-10 pt-6 border-t border-white/10">
            © 2026 AUTODUX – Todos los derechos reservados | www.autodux.com.ar
          </p>
        </div>
      </div>
    </MainLayout>
  )
}
