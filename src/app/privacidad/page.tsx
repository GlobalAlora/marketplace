import type { Metadata } from 'next'
import MainLayout from '@/components/layout/MainLayout'

export const metadata: Metadata = {
  title: 'Política de privacidad — AUTODUX',
}

const H2 = 'text-xl font-bold text-white mt-10 mb-3'
const H3 = 'text-base font-bold text-white mt-6 mb-2'
const P = 'text-gray-400 text-sm leading-relaxed mb-3'
const UL = 'list-disc pl-5 space-y-1.5 text-gray-400 text-sm leading-relaxed mb-3'
const LINK = 'text-[#FFC107] hover:underline'

export default function PrivacidadPage() {
  return (
    <MainLayout>
      <div className="bg-[#0D0F14] min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Política de privacidad
          </h1>
          <p className="text-xs text-gray-600 mb-8">AUTODUX</p>

          <h2 className={H2}>1. Identificación del responsable del tratamiento</h2>
          <p className={P}>El responsable del tratamiento de los datos personales recopilados a través de la Plataforma es:</p>
          <ul className={UL}>
            <li>Titular: Abril Duarte</li>
            <li>CUIT: 27-46465111-5</li>
            <li>Domicilio: Calle 3117 N° 756, Comodoro Rivadavia, Provincia de Chubut, República Argentina</li>
            <li>Correo electrónico: grupoautodux@gmail.com</li>
            <li>Sitio web: <a href="https://www.autodux.com.ar" className={LINK}>www.autodux.com.ar</a></li>
          </ul>
          <p className={P}>
            La presente Política de Privacidad regula el tratamiento de datos personales realizado por AUTODUX en el marco
            de la Ley N° 25.326 de Protección de Datos Personales y su Decreto Reglamentario N° 1558/2001.
          </p>

          <h2 className={H2}>2. Datos que recopilamos</h2>

          <h3 className={H3}>2.1 Datos proporcionados directamente por el Usuario</h3>
          <p className={P}>Al registrarse en la Plataforma, el Usuario proporciona los siguientes datos personales:</p>
          <ul className={UL}>
            <li>Nombre y apellido</li>
            <li>Dirección de correo electrónico</li>
            <li>Número de teléfono</li>
            <li>Dirección (para Usuarios agencia)</li>
          </ul>
          <p className={P}>
            Al publicar un vehículo, el Usuario proporciona adicionalmente información sobre el vehículo (descripción,
            kilometraje, precio, imágenes y demás datos del aviso), la cual es de carácter público dentro de la Plataforma.
          </p>

          <h3 className={H3}>2.2 Datos recopilados mediante inicio de sesión con Google</h3>
          <p className={P}>
            La Plataforma ofrece la posibilidad de registrarse e iniciar sesión mediante la cuenta de Google del Usuario.
            En tal caso, AUTODUX recibe de Google únicamente los datos que el Usuario autoriza compartir, que pueden
            incluir nombre, apellido y dirección de correo electrónico. AUTODUX no accede a la contraseña de Google ni a
            información adicional no autorizada expresamente por el Usuario. El uso de este método de acceso está
            sujeto también a la Política de Privacidad de Google, disponible en{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className={LINK}>policies.google.com/privacy</a>.
          </p>

          <h3 className={H3}>2.3 Datos recopilados de forma automática</h3>
          <p className={P}>
            Al navegar por la Plataforma, AUTODUX y sus herramientas tecnológicas pueden recopilar automáticamente los
            siguientes datos:
          </p>
          <ul className={UL}>
            <li>Dirección IP y datos de geolocalización aproximada</li>
            <li>Tipo de dispositivo, sistema operativo y navegador utilizado</li>
            <li>Páginas visitadas, tiempo de permanencia y acciones realizadas dentro de la Plataforma</li>
            <li>Datos de navegación recopilados mediante cookies y tecnologías similares (ver Sección 6 — Cookies)</li>
          </ul>

          <h2 className={H2}>3. Finalidad del tratamiento</h2>

          <h3 className={H3}>3.1 Gestión de la cuenta y el servicio</h3>
          <ul className={UL}>
            <li>Crear, mantener y gestionar la cuenta del Usuario en la Plataforma.</li>
            <li>Verificar la identidad del Usuario y prevenir el uso fraudulento de la Plataforma.</li>
            <li>Facilitar el contacto entre Usuarios interesados en una publicación y el Usuario publicante.</li>
            <li>Gestionar la contratación, facturación y renovación de planes pagos.</li>
            <li>Enviar notificaciones operativas relacionadas con la cuenta, publicaciones y vencimientos de plan.</li>
          </ul>

          <h3 className={H3}>3.2 Mejora del servicio</h3>
          <ul className={UL}>
            <li>Analizar el comportamiento de navegación de los Usuarios de forma agregada y anonimizada para mejorar la experiencia en la Plataforma.</li>
            <li>Identificar errores técnicos, fallas de rendimiento y oportunidades de mejora.</li>
          </ul>

          <h3 className={H3}>3.3 Comunicaciones comerciales</h3>
          <ul className={UL}>
            <li>
              Enviar al Usuario información sobre novedades, nuevas funcionalidades, promociones y servicios de AUTODUX,
              siempre que el Usuario haya otorgado su consentimiento o no haya revocado la autorización otorgada al
              momento del registro.
            </li>
            <li>
              El Usuario podrá darse de baja de las comunicaciones comerciales en cualquier momento mediante solicitud a
              grupoautodux@gmail.com, sin que ello afecte el uso general de la Plataforma.
            </li>
          </ul>

          <h3 className={H3}>3.4 Cumplimiento legal</h3>
          <ul className={UL}>
            <li>Dar cumplimiento a obligaciones legales, requerimientos de autoridades judiciales o administrativas competentes, y a lo establecido en los Términos y Condiciones de la Plataforma.</li>
          </ul>
          <p className={P}>
            AUTODUX no utilizará los datos personales de los Usuarios para finalidades distintas a las enunciadas en
            esta Política sin obtener previamente el consentimiento expreso del Usuario o sin estar habilitado por la
            legislación vigente.
          </p>

          <h2 className={H2}>4. Compartir datos con terceros</h2>
          <p className={P}>
            AUTODUX no vende, alquila ni cede datos personales de los Usuarios a terceros con fines comerciales propios
            de dichos terceros. Los datos personales podrán ser compartidos únicamente en los siguientes casos:
          </p>

          <h3 className={H3}>4.1 Entre Usuarios de la Plataforma</h3>
          <p className={P}>
            Cuando un Usuario realiza una consulta sobre una publicación, sus datos de contacto (nombre y teléfono y/o
            correo electrónico) serán compartidos con el Usuario publicante a los efectos de facilitar la comunicación
            entre las partes. El Usuario presta su consentimiento a este tratamiento al momento de realizar la consulta.
          </p>

          <h3 className={H3}>4.2 Proveedores de servicios tecnológicos</h3>
          <p className={P}>
            AUTODUX utiliza servicios de terceros para el funcionamiento, análisis y promoción de la Plataforma, los
            cuales pueden tener acceso a datos personales de los Usuarios en su carácter de encargados del tratamiento:
          </p>
          <ul className={UL}>
            <li>
              <strong className="text-gray-300">Google Analytics:</strong> Herramienta de análisis de tráfico web operada
              por Google LLC. Recopila datos de navegación de forma anonimizada para permitir a AUTODUX comprender el uso
              de la Plataforma. El Usuario puede optar por no ser rastreado instalando el complemento de inhabilitación de
              Google Analytics disponible en{' '}
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className={LINK}>tools.google.com/dlpage/gaoptout</a>.
              El tratamiento de datos por parte de Google se rige por su Política de Privacidad disponible en{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className={LINK}>policies.google.com/privacy</a>.
            </li>
            <li>
              <strong className="text-gray-300">Meta Pixel (Facebook/Instagram):</strong> Herramienta de seguimiento operada
              por Meta Platforms Inc. que permite a AUTODUX medir la efectividad de sus campañas publicitarias en Facebook
              e Instagram y mostrar anuncios relevantes a Usuarios y públicos similares. El Usuario puede gestionar sus
              preferencias publicitarias desde su configuración de cuenta en Facebook o Instagram. El tratamiento de datos
              por parte de Meta se rige por su Política de Privacidad disponible en{' '}
              <a href="https://facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer" className={LINK}>facebook.com/privacy/policy</a>.
            </li>
          </ul>

          <h3 className={H3}>4.3 Procesadores de pago</h3>
          <p className={P}>
            Los datos necesarios para procesar pagos (incluyendo datos bancarios o de cuenta) son gestionados
            directamente por las plataformas de pago utilizadas (como Mercado Pago o entidades bancarias). AUTODUX no
            almacena datos de tarjetas de crédito, débito ni credenciales bancarias de los Usuarios.
          </p>

          <h3 className={H3}>4.4 Requerimientos legales</h3>
          <p className={P}>
            AUTODUX podrá divulgar datos personales de los Usuarios cuando sea requerido por orden judicial, autoridad
            administrativa competente o cuando sea necesario para proteger los derechos, la seguridad o la propiedad de
            AUTODUX, sus Usuarios o terceros.
          </p>

          <h2 className={H2}>5. Derechos del Usuario</h2>
          <p className={P}>
            En virtud de lo establecido por la Ley N° 25.326 de Protección de Datos Personales, el Usuario titular de los
            datos tiene derecho a:
          </p>

          <h3 className={H3}>5.1 Derecho de acceso</h3>
          <p className={P}>
            Solicitar en forma gratuita información sobre los datos personales que AUTODUX conserva sobre su persona, la
            finalidad de su tratamiento y el origen de los mismos.
          </p>

          <h3 className={H3}>5.2 Derecho de rectificación</h3>
          <p className={P}>
            Solicitar la corrección de datos personales inexactos, incompletos, desactualizados o que induzcan a error.
          </p>

          <h3 className={H3}>5.3 Derecho de supresión</h3>
          <p className={P}>
            Solicitar la eliminación de sus datos personales cuando los mismos sean innecesarios para la finalidad que
            motivó su recopilación, cuando haya revocado su consentimiento, o cuando su tratamiento sea contrario a la
            Ley N° 25.326. La supresión no procederá cuando pudiera causar perjuicios a derechos o intereses legítimos de
            terceros, o cuando existiera una obligación legal de conservación.
          </p>

          <h3 className={H3}>5.4 Derecho de confidencialidad</h3>
          <p className={P}>
            Solicitar que sus datos personales no sean cedidos a terceros en los casos no previstos en esta Política.
          </p>

          <h3 className={H3}>5.5 Ejercicio de derechos</h3>
          <p className={P}>
            El Usuario podrá ejercer cualquiera de los derechos mencionados enviando una solicitud escrita a
            grupoautodux@gmail.com, indicando:
          </p>
          <ul className={UL}>
            <li>Nombre completo y datos de contacto</li>
            <li>Derecho que desea ejercer</li>
            <li>Descripción clara de la solicitud</li>
          </ul>
          <p className={P}>
            AUTODUX responderá la solicitud dentro de los cinco (5) días hábiles de recibida, conforme a los plazos
            establecidos por la legislación vigente. La respuesta podrá extenderse hasta treinta (30) días corridos en
            casos de especial complejidad, informando al Usuario dicha circunstancia.
          </p>

          <h3 className={H3}>5.6 Autoridad de control</h3>
          <p className={P}>
            El Usuario tiene derecho a presentar una reclamación ante la Agencia de Acceso a la Información Pública
            (AAIP), organismo de control en materia de protección de datos personales en la República Argentina, con
            domicilio en Av. Pte. Gral. Julio A. Roca 710, piso 2°, Ciudad Autónoma de Buenos Aires. Sitio web:{' '}
            <a href="https://www.argentina.gob.ar/aaip" target="_blank" rel="noopener noreferrer" className={LINK}>www.argentina.gob.ar/aaip</a>.
          </p>

          <h2 className={H2}>6. Cookies y tecnologías de seguimiento</h2>

          <h3 className={H3}>6.1 ¿Qué son las cookies?</h3>
          <p className={P}>
            Las cookies son pequeños archivos de texto que se almacenan en el dispositivo del Usuario al navegar por la
            Plataforma. Permiten recordar preferencias, mantener sesiones activas y recopilar información sobre el
            comportamiento de navegación.
          </p>

          <h3 className={H3}>6.2 Tipos de cookies utilizadas por AUTODUX</h3>
          <p className={P}>
            <strong className="text-gray-300">Cookies estrictamente necesarias:</strong> Son indispensables para el
            funcionamiento básico de la Plataforma. Permiten mantener la sesión iniciada del Usuario, recordar
            preferencias de navegación y garantizar la seguridad de la cuenta. No pueden ser desactivadas sin afectar el
            funcionamiento de la Plataforma.
          </p>
          <p className={P}>
            <strong className="text-gray-300">Cookies analíticas:</strong> Utilizadas mediante Google Analytics para
            recopilar información estadística sobre el uso de la Plataforma de forma agregada y anonimizada, incluyendo
            páginas visitadas, tiempo de permanencia y dispositivos utilizados. Esta información permite a AUTODUX
            mejorar la experiencia del Usuario.
          </p>
          <p className={P}>
            <strong className="text-gray-300">Cookies de seguimiento publicitario:</strong> Utilizadas mediante Meta
            Pixel (Facebook/Instagram) para medir la efectividad de las campañas publicitarias de AUTODUX y mostrar
            anuncios personalizados a Usuarios y públicos similares en las plataformas de Meta. Estos datos pueden ser
            asociados al perfil del Usuario en dichas plataformas.
          </p>

          <h3 className={H3}>6.3 Gestión de cookies</h3>
          <p className={P}>
            El Usuario puede gestionar, limitar o eliminar las cookies desde la configuración de su navegador. A
            continuación se indican los enlaces de configuración de los navegadores más utilizados:
          </p>
          <ul className={UL}>
            <li>Google Chrome: <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className={LINK}>support.google.com/chrome/answer/95647</a></li>
            <li>Mozilla Firefox: <a href="https://support.mozilla.org/kb/enable-and-disable-cookies" target="_blank" rel="noopener noreferrer" className={LINK}>support.mozilla.org/kb/enable-and-disable-cookies</a></li>
            <li>Safari: <a href="https://support.apple.com/guide/safari/manage-cookies" target="_blank" rel="noopener noreferrer" className={LINK}>support.apple.com/guide/safari/manage-cookies</a></li>
            <li>Microsoft Edge: <a href="https://support.microsoft.com/microsoft-edge" target="_blank" rel="noopener noreferrer" className={LINK}>support.microsoft.com/microsoft-edge</a></li>
          </ul>
          <p className={P}>
            La desactivación de cookies analíticas o publicitarias no afectará el acceso a las funcionalidades principales
            de la Plataforma. Sin embargo, la desactivación de cookies estrictamente necesarias puede impedir el correcto
            funcionamiento de determinadas secciones.
          </p>

          <h3 className={H3}>6.4 Cookies de terceros</h3>
          <p className={P}>
            Las cookies instaladas por Google y Meta están sujetas a las políticas de privacidad de dichas empresas.
            AUTODUX no controla el tratamiento de datos realizado por estos terceros a través de sus propias cookies.
          </p>

          <h2 className={H2}>7. Seguridad de los datos</h2>
          <p className={P}>
            AUTODUX adopta medidas técnicas y organizativas razonables para proteger los datos personales de los
            Usuarios frente a accesos no autorizados, pérdida, alteración, divulgación o destrucción. Entre dichas
            medidas se incluyen el uso de conexiones cifradas (HTTPS), controles de acceso restringido a los datos y
            revisiones periódicas de seguridad.
          </p>
          <p className={P}>
            No obstante, ningún sistema de seguridad es absolutamente infalible. AUTODUX no puede garantizar la
            seguridad absoluta de los datos transmitidos a través de Internet ni la ausencia total de vulnerabilidades.
            En caso de detectarse una brecha de seguridad que afecte datos personales de los Usuarios, AUTODUX tomará
            las medidas correctivas correspondientes e informará a los Usuarios afectados y a la Agencia de Acceso a la
            Información Pública (AAIP) conforme a la normativa vigente.
          </p>

          <h2 className={H2}>8. Retención de datos</h2>
          <p className={P}>
            AUTODUX conservará los datos personales de los Usuarios durante el tiempo que la cuenta permanezca activa y
            por un período adicional de hasta doce (12) meses desde la baja o cancelación de la misma, a los efectos de
            cumplir con obligaciones legales, resolver disputas y hacer cumplir los Términos y Condiciones.
          </p>
          <p className={P}>
            Vencido dicho plazo, los datos serán eliminados o anonimizados de forma definitiva, salvo que una obligación
            legal exija su conservación por un período mayor. El Usuario podrá solicitar la eliminación anticipada de sus
            datos conforme a lo establecido en la Sección 5 de esta Política.
          </p>

          <h2 className={H2}>9. Menores de edad</h2>
          <p className={P}>
            La Plataforma está destinada exclusivamente a personas mayores de 18 años. AUTODUX no recopila
            intencionalmente datos personales de menores de edad. Si AUTODUX tomara conocimiento de que ha recopilado
            datos de un menor sin el consentimiento verificable de sus padres o tutores legales, procederá a eliminar
            dichos datos de forma inmediata y a cancelar la cuenta asociada.
          </p>
          <p className={P}>
            Si un padre, madre o tutor legal detectara que un menor ha proporcionado datos personales a través de la
            Plataforma, deberá notificarlo a grupoautodux@gmail.com para que AUTODUX pueda tomar las medidas
            correspondientes.
          </p>

          <h2 className={H2}>10. Modificaciones a esta Política</h2>
          <p className={P}>
            AUTODUX podrá modificar la presente Política de Privacidad en cualquier momento, publicando la versión
            actualizada en autodux.com.ar/privacidad con indicación de la fecha de última actualización. El uso
            continuado de la Plataforma con posterioridad a la publicación de las modificaciones implicará la aceptación
            de la nueva Política. Se recomienda al Usuario revisar periódicamente este documento.
          </p>

          <h2 className={H2}>11. Contacto</h2>
          <p className={P}>
            Para consultas, solicitudes o reclamos relacionados con el tratamiento de datos personales, el Usuario podrá
            contactarse con AUTODUX a través de:
          </p>
          <ul className={UL}>
            <li>Correo electrónico: grupoautodux@gmail.com</li>
            <li>Sitio web: <a href="https://www.autodux.com.ar" className={LINK}>www.autodux.com.ar</a></li>
          </ul>
          <p className={P}>
            La AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, en su carácter de Órgano de Control de la Ley N° 25.326,
            tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus
            derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.
          </p>

          <p className="text-xs text-gray-600 mt-10 pt-6 border-t border-white/10">
            © 2026 AUTODUX – Todos los derechos reservados | www.autodux.com.ar
          </p>
        </div>
      </div>
    </MainLayout>
  )
}
