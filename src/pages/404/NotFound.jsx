import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import HomeIcon from '@mui/icons-material/Home'
import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as PlanetSvg } from '~/assets/404/planet.svg'
import { ReactComponent as AstronautSvg } from '~/assets/404/astronaut.svg'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        bgcolor: '#0b0c10',
        overflow: 'hidden',
        color: 'white',
        position: 'relative',
        fontFamily: 'sans-serif'
      }}
    >
      {/* Galaxy Background (CSS only, no library) */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',

          // ----- LỚP SAO NHỎ -----
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(2px 2px at 20% 30%, white, transparent), radial-gradient(2px 2px at 80% 70%, white, transparent), radial-gradient(1.5px 1.5px at 50% 50%, white, transparent), radial-gradient(1.2px 1.2px at 70% 20%, white, transparent), radial-gradient(1px 1px at 30% 80%, white, transparent)',
            backgroundRepeat: 'repeat',
            backgroundSize: '300px 300px',
            opacity: 0.4,

            animation: 'twinkle 6s infinite alternate'
          },

          // ----- LỚP NEBULA GALAXY -----
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(circle at 30% 50%, rgba(0,150,255,0.25), transparent 60%),
              radial-gradient(circle at 70% 60%, rgba(255,0,200,0.15), transparent 70%),
              radial-gradient(circle at 50% 80%, rgba(255,150,0,0.1), transparent 70%)
            `,
            filter: 'blur(60px)',
            animation: 'nebulaMove 20s ease-in-out infinite'
          },

          '@keyframes twinkle': {
            '0%': { opacity: 0.3 },
            '100%': { opacity: 0.6 }
          },

          '@keyframes nebulaMove': {
            '0%': { transform: 'translateY(0px) scale(1)' },
            '50%': { transform: 'translateY(-25px) scale(1.05)' },
            '100%': { transform: 'translateY(0px) scale(1)' }
          }
        }}
      />


      {/* Text Center */}
      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 2
        }}
      >
        <Typography
          variant="h1"
          fontWeight="bold"
          sx={{ mb: 1, fontSize: '90px', letterSpacing: '3px' }}
        >
          404
        </Typography>

        {/* Dòng 1 */}
        <Typography
          sx={{
            fontSize: '26px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            mb: 1,
            opacity: 0.95
          }}
        >
          LOST IN{' '}
          <span
            style={{
              textDecoration: 'line-through',
              textDecorationColor: 'rgba(255,255,255,0.8)',
              textDecorationThickness: '3px'
            }}
          >
            SPACE
          </span>
          {' '}XuanTriDev?
        </Typography>


        {/* Dòng 2 */}
        <Typography
          sx={{
            mb: 3,
            maxWidth: 500,
            mx: 'auto',
            fontSize: '20px',
            opacity: 0.85
          }}
        >
          Hmm, looks like that page doesn't exist.
        </Typography>
      </Box>


      {/* Planet + Astronaut Group */}
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          left: '50%',
          transform: 'translateX(-10%)',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          zIndex: 2
        }}
      >
        {/* Planet */}
        <Box
          sx={{
            width: 50,
            height: 50,
            '@keyframes floatPlanet': {
              '0%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-25px)' },
              '100%': { transform: 'translateY(0px)' }
            },
            animation: 'floatPlanet 6s ease-in-out infinite',
            opacity: 0.9
          }}
        >
          <SvgIcon
            component={PlanetSvg}
            inheritViewBox
            sx={{
              width: '100%',
              height: 'auto',
              transform: 'scale(10)',
              transformOrigin: 'center'
            }}
          />
        </Box>

        {/* Astronaut floating + rotating IN PLACE */}
        <Box
          sx={{
            width: 180,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

            // animation chỉ cho chuyển động lên xuống
            '@keyframes floatAstro': {
              '0%': { marginTop: '0px' },
              '50%': { marginTop: '-15px' },
              '100%': { marginTop: '0px' }
            },
            animation: 'floatAstro 4s ease-in-out infinite'
          }}
        >
          {/* Layer xoay tại chỗ */}
          <Box
            sx={{
              '@keyframes rotateInPlace': {
                from: { transform: 'rotate(0deg)' },
                to: { transform: 'rotate(360deg)' }
              },
              animation: 'rotateInPlace 6s linear infinite',
              width: 120,
              height: 120,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '-400px'
            }}
          >
            <SvgIcon
              component={AstronautSvg}
              inheritViewBox
              sx={{
                width: '180%',
                transformOrigin: 'center',
                scale: 2.5
              }}
            />
          </Box>
        </Box>

      </Box>

      {/* Button at bottom center */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3
        }}
      >
        <Button
          variant="contained"
          component={Link}
          to="/"
          startIcon={<HomeIcon />}
          sx={{
            px: 4,
            py: 1.4,
            fontSize: '18px',
            fontWeight: 'bold',
            borderRadius: '50px',
            textTransform: 'none',
            background: 'linear-gradient(45deg, #3a8dfd, #6f2bff)',
            boxShadow: '0 4px 15px rgba(80, 120, 255, 0.4)',
            transition: '0.25s ease',
            '&:hover': {
              transform: 'scale(1.06)',
              boxShadow: '0 6px 25px rgba(80, 120, 255, 0.55)',
              background: 'linear-gradient(45deg, #4c9aff, #7b3bff)'
            }
          }}
        >
          Go Home
        </Button>
      </Box>

    </Box>
  )
}
