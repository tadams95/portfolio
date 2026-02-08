const YEAR = new Date().getFullYear()

export default {
  darkMode: true,
  footer: (
    <small style={{ display: 'block', marginTop: 'auto' }}>
      Tyrelle Adams © <time>{YEAR}</time> 🥷
      <style jsx>{`
        a {
          float: right;
        }
        @media screen and (max-width: 480px) {
          article {
            padding-top: 2rem;
            padding-bottom: 4rem;
          }
        }
      `}</style>
    </small>
  )
}
