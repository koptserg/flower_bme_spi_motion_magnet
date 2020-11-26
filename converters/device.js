    {
        zigbeeModel: ['DIYRuZ_Motion'],
        model: 'DIYRuZ_Motion',
        vendor: 'DIYRuZ',
        description: '[Motion sensor](http://modkam.ru/?p=1700)',
        supports: 'temperature, humidity, illuminance, soil_moisture, pressure, battery, occupancy',
        fromZigbee: [
            fz.temperature,
            fz.humidity,
            fz.illuminance,
            fz.soil_moisture,
            fz.pressure,
            fz.battery,
            fz.occupancy,
            fz.occupancy_sensor_type,
        ],
        toZigbee: [
            tz.occupancy_timeout,
            tz.factory_reset,
        ],
        meta: {
            configureKey: 1,
            multiEndpoint: true,
        },
        endpoint: (device) => {
            return {
                'bme': 1,
                'ds': 2,
                'mot': 3,
            };
        },
        configure: async (device, coordinatorEndpoint) => {
            const firstEndpoint = device.getEndpoint(1);
            const secondEndpoint = device.getEndpoint(2);
            const thirdEndpoint = device.getEndpoint(3);
            await bind(firstEndpoint, coordinatorEndpoint, [
                'genPowerCfg',
                'msTemperatureMeasurement',
                'msRelativeHumidity',
                'msPressureMeasurement',
                'msIlluminanceMeasurement',
                'msSoilMoisture',
            ]);
            await bind(secondEndpoint, coordinatorEndpoint, [
                'msTemperatureMeasurement',
            ]);
            await bind(thirdEndpoint, coordinatorEndpoint, [
                'msOccupancySensing',
            ]);
            const overides = {min: 0, max: 3600, change: 0};
            await configureReporting.batteryVoltage(firstEndpoint, overides);
            await configureReporting.batteryPercentageRemaining(firstEndpoint, overides);
            await configureReporting.temperature(firstEndpoint, overides);
            await configureReporting.humidity(firstEndpoint, overides);
            await configureReporting.pressureExtended(firstEndpoint, overides);
            await configureReporting.illuminance(firstEndpoint, overides);
            await configureReporting.soil_moisture(firstEndpoint, overides);
            await configureReporting.temperature(secondEndpoint, overides);
            await configureReporting.occupancy(thirdEndpoint, overides);
//            await configureReporting.occupancy_sensor_type(thirdEndpoint, overides);
//            await configureReporting.occupancy_timeout(thirdEndpoint, overides);
            await firstEndpoint.read('msPressureMeasurement', ['scale']);
        },
        exposes: [
            exposes.numeric('temperature').withUnit('В°C'), exposes.numeric('humidity').withUnit('%'),
            exposes.numeric('illuminance'), exposes.numeric('illuminance_lux').withUnit('lx'),
            exposes.numeric('soil_moisture').withUnit('%'), exposes.numeric('pressure').withUnit('hPa'),
            exposes.numeric('battery').withUnit('%'),
        ],
    },