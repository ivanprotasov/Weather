import MainWeatherData from './mainWeatherDataInterface'

interface SityWeatherData {
    id: number,
    name: string,
    main: MainWeatherData
}

export default SityWeatherData;