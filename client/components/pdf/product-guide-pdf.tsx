/* eslint-disable jsx-a11y/alt-text */
"use client"

import { Page, Text, View, Document, StyleSheet, Image, Font } from "@react-pdf/renderer"
import { Product } from "@/lib/types/product"

// Register fonts if needed, otherwise use default
Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/helveticaneue/v1/1.ttf' },
        { src: 'https://fonts.gstatic.com/s/helveticaneue/v1/2.ttf', fontWeight: 700 },
    ]
})

const styles = StyleSheet.create({
    page: {
        padding: 50,
        fontFamily: 'Helvetica',
        color: '#1a1a1a',
        backgroundColor: '#fff',
    },
    badge: {
        backgroundColor: '#dcfce7',
        color: '#166534',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        alignSelf: 'flex-start',
        marginBottom: 12,
        letterSpacing: 1,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#052e16',
        marginBottom: 20,
        textTransform: 'uppercase',
        letterSpacing: -1,
    },
    description: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 1.6,
        marginBottom: 40,
        maxWidth: '90%',
    },
    contentRow: {
        flexDirection: 'row',
        gap: 30,
    },
    column: {
        flex: 1,
        backgroundColor: '#f9fafb',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#166534',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        paddingBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    label: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: 1,
        width: '40%',
    },
    value: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#111827',
        textAlign: 'right',
        width: '60%',
    },
})

interface ProductGuidePDFProps {
    product: Product
}

export const ProductGuidePDF = ({ product }: ProductGuidePDFProps) => {
    // Process seasonality to string
    const seasonStr = product.seasonality && Array.isArray(product.seasonality)
        ? product.seasonality.join(', ')
        : (product.seasonality || 'N/A');

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Product Header */}
                <View style={styles.badge}>
                    <Text>{product.cropName || product.category || 'Quality Seeds'}</Text>
                </View>

                <Text style={styles.title}>{product.name}</Text>

                <Text style={styles.description}>
                    {product.description || product.longDescription}
                </Text>

                {/* Info Grid */}
                <View style={styles.contentRow}>
                    {/* Traits Column */}
                    <View style={styles.column}>
                        <Text style={styles.sectionHeader}>Traits</Text>

                        {product.seedColor && (
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Seed Color</Text>
                                <Text style={styles.value}>{product.seedColor}</Text>
                            </View>
                        )}

                        {product.varietyType && (
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Variety Type</Text>
                                <Text style={styles.value}>{product.varietyType}</Text>
                            </View>
                        )}

                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Season</Text>
                            <Text style={styles.value}>{seasonStr}</Text>
                        </View>
                    </View>

                    {/* Cultivation Column */}
                    <View style={styles.column}>
                        <Text style={styles.sectionHeader}>Cultivation</Text>

                        {product.maturityTime && (
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Maturity</Text>
                                <Text style={styles.value}>{product.maturityTime}</Text>
                            </View>
                        )}

                        {product.yieldExpectation && (
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Yield</Text>
                                <Text style={styles.value}>{product.yieldExpectation}</Text>
                            </View>
                        )}

                        {product.sowingTime && (
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Sowing Time</Text>
                                <Text style={styles.value}>{product.sowingTime}</Text>
                            </View>
                        )}

                        {product.harvestTime && (
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Harvest Time</Text>
                                <Text style={styles.value}>{product.harvestTime}</Text>
                            </View>
                        )}

                        {product.soilType && (
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Soil Type</Text>
                                <Text style={styles.value}>{product.soilType}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </Page>
        </Document>
    );
}
