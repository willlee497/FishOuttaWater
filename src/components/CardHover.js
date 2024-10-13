import { HoverEffect } from '../components/ui/card-hover-effects';


export default function CardHoverEffect() {
    return (
        <div className="max-w-5xl mx-auto px-8">
            <HoverEffect items={reasons} />
        </div>
    );
}

export const reasons = [
    {
        title: 'Biodiversity Decline',
        description:
            'Invasive species like Asian Carp outcompete native fish for food, reducing biodiversity. This weakens the resilience of ecosystems, making them more vulnerable to environmental changes.',
    },
    {
        title: 'Fisheries Disruption',
        description:
            'Lionfish in the Caribbean consume commercially valuable species like snapper, impacting local fisheries and tourism industries that rely on healthy marine ecosystems.',
    },
    {
        title: 'Water Quality Degradation',
        description:
            'European Carp disrupt aquatic ecosystems by uprooting plants and stirring up sediment, leading to poor water quality, which harms native species and affects human use of these waters.',
    },
    {
        title: 'Predation on Native Species',
        description:
            'Snakehead Fish are aggressive predators that decimate native fish and amphibians, leading to the collapse of native populations and causing imbalances in aquatic ecosystems.',
    },
    {
        title: 'Economic and Ecosystem Loss',
        description:
            'Zander in European lakes outcompete local species, harming both the fishing industry and the natural ecosystem by reducing native fish populations that support aquatic health.',
    },
    {
        title: 'Ecosystem Collapse',
        description:
            'Nile Perch in Lake Victoria led to the collapse of native fish species, which triggered broader ecological damage, affecting both the lake’s biodiversity and human reliance on it for food.',
    },
];
